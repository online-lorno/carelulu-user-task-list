import { PrismaClient } from '@prisma/client';

import { hashPassword } from '../src/_helpers/password.helper';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: 'username' },
    update: {
      username: 'username',
      password: await hashPassword('password'),
      name: 'User Name',
    },
    create: {
      username: 'username',
      password: await hashPassword('password'),
      name: 'User Name',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
