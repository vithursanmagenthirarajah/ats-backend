import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      email: string;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
