import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const discussionCount = await prisma.discussion.count();
    const latestDiscussions = await prisma.discussion.findMany({
      take: 5,
      select: { id: true, title: true }
    });

    console.log('--- DATABASE STATS ---');
    console.log('Users:', userCount);
    console.log('Discussions:', discussionCount);
    console.log('Latest Discussions:', JSON.stringify(latestDiscussions, null, 2));
    
  } catch (error) {
    console.error('Database Check Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
