import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Kayıtlı Kullanıcılar ---');
    const users = await prisma.user.findMany({
        select: { id: true, username: true, email: true }
    });
    console.log(users);

    console.log('\n--- Kayıtlı Tartışmalar ---');
    const discussions = await prisma.discussion.findMany({
        include: {
            author: {
                select: { username: true }
            }
        }
    });
    console.log(JSON.stringify(discussions, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
