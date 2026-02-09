import prisma from "@/lib/prisma/client";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import KYCView from "./kyc-view";

export default async function KYCPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    const dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id },
        select: {
            kycStatus: true,
        }
    });

    if (!dbUser) {
        return notFound();
    }

    // Default to NOT_SUBMITTED if null or unknown
    const status = (dbUser.kycStatus === "APPROVED" || dbUser.kycStatus === "PENDING" || dbUser.kycStatus === "REJECTED")
        ? dbUser.kycStatus
        : "NOT_SUBMITTED";

    return (
        <KYCView initialStatus={status} />
    );
}
