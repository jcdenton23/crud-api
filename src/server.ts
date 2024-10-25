import { createServer } from 'http';
import { userRoutes } from './routes/userRoutes';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = createServer((req, res) => {
  userRoutes(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
