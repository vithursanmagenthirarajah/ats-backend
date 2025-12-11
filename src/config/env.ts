import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
const NODE_ENV = process.env.NODE_ENV || 'development';

export const env = {
  PORT,
  JWT_SECRET,
  DATABASE_URL,
  NODE_ENV,
};
