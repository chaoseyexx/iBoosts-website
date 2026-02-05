import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("Missing R2 environment variables.");
    process.exit(1);
}

const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

const mimeMap: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".json": "application/json",
    ".webmanifest": "application/manifest+json",
};

async function uploadFile(filePath: string, relativePath: string) {
    const fileContent = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeMap[ext] || "application/octet-stream";

    console.log(`Uploading ${relativePath} (${contentType})...`);

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: relativePath.replace(/\\/g, "/"), // Ensure forward slashes for S3 keys
        Body: fileContent,
        ContentType: contentType,
    });

    try {
        await r2.send(command);
        console.log(`Successfully uploaded ${relativePath}`);
    } catch (err) {
        console.error(`Failed to upload ${relativePath}:`, err);
    }
}

async function walkDir(dir: string, baseDir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.relative(baseDir, fullPath);
        if (fs.statSync(fullPath).isDirectory()) {
            await walkDir(fullPath, baseDir);
        } else {
            await uploadFile(fullPath, relativePath);
        }
    }
}

async function main() {
    const publicDir = path.join(process.cwd(), "public");
    console.log(`Starting sync from ${publicDir} to R2 bucket ${bucketName}...`);
    await walkDir(publicDir, publicDir);
    console.log("Sync completed.");
}

main().catch(console.error);
