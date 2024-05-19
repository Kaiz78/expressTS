import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const PORT = 3005;

app.get('/', (req, res) => {

  res.send('Hello, TypeScript with Express!');
  
});

app.get('/users', async (req,res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        users_id: true,
        name: true,
        email: true,
      }
    });

    // request customiser
    // Remove the unused variable

    // Map users2
    const users2: Array<{
      users_id: bigint;
      name: string;
      email: string;
      status: string;
    }> = await prisma.$queryRaw`SELECT * FROM users`;

    const test = users2.map((user) => {
      return {
        users_id: user.users_id.toString(),
        name: user.name,
        email: user.email,
        status: user.status,
      }
    })

    // Convertir les BigInt en chaînes de caractères
    const usersStringifiable = users.map((user) => ({
      ...user,
      users_id: user.users_id.toString()
    }));

    res.json(test);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

