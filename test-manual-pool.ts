
import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;
const finalConnectionString = connectionString.includes("uselibpqcompat")
    ? connectionString
    : connectionString.includes("?")
        ? `${connectionString}&uselibpqcompat=true`
        : `${connectionString}?uselibpqcompat=true`;

console.log("Connecting with:", finalConnectionString.replace(/:[^:@]+@/, ":****@"));

const pool = new Pool({
    connectionString: finalConnectionString,
    max: 10,
    ssl: { rejectUnauthorized: false },
});

pool.connect()
    .then(client => {
        console.log("Connected!");
        return client.query("SELECT NOW()").then(res => {
            console.log("Result:", res.rows[0]);
            client.release();
            pool.end();
        });
    })
    .catch(err => {
        console.error("Connection failed:", err);
        pool.end();
    });
