
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Status Page Data...");

    // 1. SERVICES
    const services = [
        { id: "website", name: "website", displayName: "Website & Marketplace", description: "Frontend application and user dashboard accessibility", order: 1 },
        { id: "database", name: "database", displayName: "Database Clusters", description: "Primary and replica database nodes handling user data and listings", order: 2 },
        { id: "auth", name: "auth", displayName: "Authentication", description: "User login, registration and session management systems", order: 3 },
        { id: "ishield", name: "ishield", displayName: "iShield Security", description: "Active Threat Monitoring & Fraud Prevention Engines", order: 4 },
    ];

    for (const s of services) {
        await prisma.statusComponent.upsert({
            where: { name: s.name },
            update: s,
            create: s,
        });
    }
    console.log("✅ Services upserted.");

    // 2. INCIDENTS (Mock History)
    // Only create if not exists (checked by title + date broadly, but for simplicity here we just check if any incidental exists)
    const count = await prisma.statusIncident.count();
    if (count === 0) {
        console.log("Creating initial mock incidents...");

        // Incident 1: Search Performance
        const inc1 = await prisma.statusIncident.create({
            data: {
                id: "inc-1",
                title: "Performance degradation in Marketplace search",
                status: "resolved",
                severity: "medium",
                affectedServices: ["website"],
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
            }
        });

        await prisma.statusUpdate.createMany({
            data: [
                {
                    id: "upd-1",
                    incidentId: inc1.id,
                    status: "resolved",
                    message: "Search performance has returned to normal levels after indexing optimization.",
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)
                },
                {
                    id: "upd-2",
                    incidentId: inc1.id,
                    status: "monitoring",
                    message: "We have deployed a fix and are monitoring search latencies.",
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)
                },
                {
                    id: "upd-3",
                    incidentId: inc1.id,
                    status: "investigating",
                    message: "We are investigating increased latency in marketplace search queries.",
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                }
            ]
        });

        // Incident 2: Database Maintenance
        const inc2 = await prisma.statusIncident.create({
            data: {
                id: "inc-2",
                title: "Scheduled Database Maintenance",
                status: "resolved",
                severity: "maintenance", // Custom severity
                affectedServices: ["database"],
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                resolvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
            }
        });

        await prisma.statusUpdate.createMany({
            data: [
                {
                    id: "upd-4",
                    incidentId: inc2.id,
                    status: "resolved",
                    message: "Maintenance completed successfully with no impact on user data.",
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000)
                },
                {
                    id: "upd-5",
                    incidentId: inc2.id,
                    status: "update",
                    message: "Began scheduled maintenance on primary database cluster.",
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                }
            ]
        });

        console.log("✅ Mock incidents created.");
    } else {
        console.log("ℹ️ Incidents already exist. Skipping seed.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
