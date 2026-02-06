import { seedMarketplaceData } from "@/app/(admin)/admin/actions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await seedMarketplaceData();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
