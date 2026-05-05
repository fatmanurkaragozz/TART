import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst();
    if (user) {
        console.log('User keys:', Object.keys(user));
        console.log('User ID:', user.id);
        console.log('User ID type:', typeof user.id);
    } else {
        console.log('No user found');
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
