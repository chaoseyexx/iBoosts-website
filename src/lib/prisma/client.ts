
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Connection pool for PostgreSQL
const connectionString = process.env.DATABASE_URL!;

// Ensure libpq compatibility for SSL modes is enabled (fixes self-signed cert issues on Vercel)
const finalConnectionString = connectionString.includes("uselibpqcompat")
    ? connectionString
    : connectionString.includes("?")
        ? `${connectionString}&uselibpqcompat=true`
        : `${connectionString}?uselibpqcompat=true`;

const pool = new Pool({
    connectionString: finalConnectionString,
    max: 10,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Create Prisma adapter with the pg pool
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
