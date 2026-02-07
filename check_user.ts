import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Checking user DEMOTEST...");
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: "DEMOTEST" },
                { email: { contains: "demo" } }
            ]
        }
    });
    console.log("User data:", JSON.stringify(user, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
