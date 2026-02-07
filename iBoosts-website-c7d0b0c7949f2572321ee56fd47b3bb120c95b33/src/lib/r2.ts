import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;
const publicDomain = process.env.R2_PUBLIC_DOMAIN || "https://cdn.iboosts.gg";
const jurisdiction = process.env.R2_JURISDICTION; // e.g., "eu"

// Validate critical variables
if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("R2 Error: Missing Environment Variables", {
        hasAccountId: !!accountId,
        hasAccessKey: !!accessKeyId,
        hasSecretKey: !!secretAccessKey,
        hasBucket: !!bucketName
    });
}

// Construct the endpoint URL based on jurisdiction
const endpoint = jurisdiction
    ? `https://${accountId}.${jurisdiction}.r2.cloudflarestorage.com`
    : `https://${accountId}.r2.cloudflarestorage.com`;

// Initialize S3 Client for Cloudflare R2
export const r2 = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
        accessKeyId: accessKeyId || "",
        secretAccessKey: secretAccessKey || "",
    },
});

/**
 * Uploads a file buffer to Cloudflare R2 and returns the public CDN URL.
 * @param fileBuffer - The file content as a Buffer
 * @param fileName - The desired file name (can include folders like 'avatars/user.png')
 * @param contentType - The MIME type of the file (e.g., 'image/png')
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    if (!bucketName) {
        throw new Error("R2_BUCKET_NAME is not defined in environment variables");
    }

    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: contentType,
        });

        await r2.send(command);

        // Return the public CDN URL
        return `${publicDomain}/${fileName}`;
    } catch (error) {
        console.error("Error uploading to R2:", error);
        throw error;
    }
}

/**
 * Deletes a file from Cloudflare R2.
 * @param fileName - The file key to delete (e.g., 'avatars/user.png')
 */
export async function deleteFromR2(fileName: string): Promise<void> {
    if (!bucketName) {
        throw new Error("R2_BUCKET_NAME is not defined");
    }

    try {
        const command = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: fileName,
        });

        await r2.send(command);
    } catch (error) {
        console.error("Error deleting from R2:", error);
        // We generally don't want to throw here to avoid breaking the main flow if cleanup fails
    }
}
