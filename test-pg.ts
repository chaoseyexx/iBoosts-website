
import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;

// Mimic what src/lib/prisma/client.ts does
const finalConnectionString = connectionString.includes("uselibpqcompat")
    ? connectionString
    : connectionString.includes("?")
        ? `${connectionString}&uselibpqcompat=true`
        : `${connectionString}?uselibpqcompat=true`;

console.log("Testing pg connection with:", finalConnectionString.replace(/:[^:@]+@/, ":****@"));

const pool = new Pool({
    connectionString: finalConnectionString,
    max: 10,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function main() {
    try {
        console.log("Connecting via pg...");
        const client = await pool.connect();
        console.log("Connected!");
        const res = await client.query('SELECT NOW()');
        console.log("Query result:", res.rows[0]);
        client.release();
        await pool.end();
    } catch (err) {
        console.error("PG Connection failed:", err);
    }
}

main();
