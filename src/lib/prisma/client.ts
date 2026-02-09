
// Last updated: 2026-02-08T22:35:00
import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { generateId, ModelName } from "../utils/ids";

// Connection pool for PostgreSQL
const connectionString = process.env.DATABASE_URL!;

// Ensure libpq compatibility for SSL modes is enabled (fixes self-signed cert issues on Vercel)
const finalConnectionString = connectionString.includes("uselibpqcompat")
    ? connectionString
    : connectionString.includes("?")
        ? `${connectionString}&uselibpqcompat=true`
        : `${connectionString}?uselibpqcompat=true`;

const createPrismaClient = () => {
    const isDev = process.env.NODE_ENV === "development";
    const pool = new Pool({
        connectionString: finalConnectionString,
        max: isDev ? 3 : 5, // Reduce connection limit for serverless/dev environments
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    const adapter = new PrismaPg(pool);

    const basePrisma = new PrismaClient({
        adapter,
        log:
            process.env.NODE_ENV === "development"
                ? ["query", "error", "warn"]
                : ["error"],
    });

    return basePrisma.$extends({
        query: {
            $allModels: {
                async create({ model, args, query }) {
                    // If ID is not provided, generate an elegant one
                    if (!args.data.id && typeof model === 'string') {
                        args.data.id = generateId(model as ModelName);
                    }
                    return query(args);
                },
                async createMany({ model, args, query }) {
                    if (Array.isArray(args.data) && typeof model === 'string') {
                        for (const item of args.data) {
                            if (!item.id) {
                                item.id = generateId(model as ModelName);
                            }
                        }
                    }
                    return query(args);
                },
                // We also handle upsert's create part
                async upsert({ model, args, query }) {
                    if (!args.create.id && typeof model === 'string') {
                        args.create.id = generateId(model as ModelName);
                    }
                    return query(args);
                }
            }
        }
    });
};

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
