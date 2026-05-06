import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function setAdmin() {
  const username = process.argv.slice(2).join(' ');
  if (!username) {
    console.log("Lütfen bir kullanıcı adı girin.");
    return;
  }
  
  try {
    const user = await prisma.user.update({
      where: { username },
      data: { role: 'admin' }
    });
    console.log(`Kullanıcı ${username} başarıyla admin yapıldı!`);
  } catch (err) {
    console.error("Hata:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

setAdmin();
