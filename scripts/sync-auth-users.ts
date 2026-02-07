
/**
 * Script to sync Supabase Auth users to Prisma User table.
 * Finds auth users without a corresponding Prisma User (by email) and creates/links them.
 */
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({
    connectionString: connectionString.includes("uselibpqcompat")
        ? connectionString
        : `${connectionString}${connectionString.includes("?") ? "&" : "?"}uselibpqcompat=true`,
    max: 1,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Supabase Admin Client (using service role key)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
    console.log("🔄 Syncing Supabase Auth users to Prisma User table...\n");

    // Get all auth users
    const { data: authUsers, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
        console.error("❌ Failed to fetch auth users:", error.message);
        return;
    }

    console.log(`Found ${authUsers.users.length} users in Supabase Auth.\n`);

    let synced = 0;
    let linked = 0;
    let skipped = 0;

    for (const authUser of authUsers.users) {
        const email = authUser.email;
        if (!email) {
            console.log(`⚠️  Skipping user ${authUser.id} (no email)`);
            skipped++;
            continue;
        }

        // Check if user exists in Prisma by email
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            // User exists - check if supabaseId is linked
            if (existingUser.supabaseId === authUser.id) {
                console.log(`✔️  ${email} already linked`);
                skipped++;
            } else {
                // Link the supabaseId
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: { supabaseId: authUser.id }
                });
                console.log(`🔗 Linked ${email} to supabaseId: ${authUser.id}`);
                linked++;
            }
        } else {
            // Create new Prisma user
            const username = authUser.user_metadata?.username || email.split("@")[0];
            await prisma.user.create({
                data: {
                    email,
                    username,
                    supabaseId: authUser.id,
                    role: "BUYER",
                    status: "ACTIVE",
                    wallet: { create: { balance: 0, pendingBalance: 0 } }
                }
            });
            console.log(`➕ Created user: ${email} (${username})`);
            synced++;
        }
    }

    console.log(`\n✨ Sync complete!`);
    console.log(`   - Created: ${synced}`);
    console.log(`   - Linked: ${linked}`);
    console.log(`   - Skipped: ${skipped}`);
}

main()
    .catch(console.error)
    .finally(() => {
        prisma.$disconnect();
        pool.end();
    });
