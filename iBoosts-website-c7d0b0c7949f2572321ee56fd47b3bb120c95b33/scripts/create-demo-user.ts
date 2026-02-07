/**
 * Create Demo User in Supabase Auth
 * 
 * This script creates the demo account in Supabase Auth.
 * Run with: npx tsx scripts/create-demo-user.ts
 * 
 * Credentials:
 * - Email: demo@iboosts.gg
 * - Password: password123
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase environment variables");
    console.log("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function main() {
    console.log("🔐 Creating demo user in Supabase Auth...");

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
        (u) => u.email === "demo@iboosts.gg"
    );

    if (existingUser) {
        console.log("✅ Demo user already exists:", existingUser.id);
        console.log("\n📋 Demo Account Credentials:");
        console.log("   Email: demo@iboosts.gg");
        console.log("   Password: password123");
        return;
    }

    // Create new user
    const { data: newUser, error } = await supabase.auth.admin.createUser({
        email: "demo@iboosts.gg",
        password: "password123",
        email_confirm: true,
        user_metadata: {
            username: "DEMO",
            display_name: "Demo User",
        },
    });

    if (error) {
        console.error("❌ Failed to create demo user:", error.message);
        process.exit(1);
    }

    console.log("✅ Demo user created successfully!");
    console.log("   Supabase ID:", newUser.user.id);
    console.log("\n📋 Demo Account Credentials:");
    console.log("   Email: demo@iboosts.gg");
    console.log("   Password: password123");
}

main();
