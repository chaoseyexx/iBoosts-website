import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadToR2 } from "@/lib/r2";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const orderId = formData.get('orderId') as string;

        if (!file || !orderId) {
            return NextResponse.json({ error: "Missing file or orderId" }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: "Only images are allowed" }, { status: 400 });
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
        }

        // Convert to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `chat/${orderId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

        // Upload to R2
        const publicUrl = await uploadToR2(buffer, fileName, file.type);

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("Chat upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
