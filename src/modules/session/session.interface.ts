import { User } from "../user/user.schema.ts";

export interface CreateSession {
  userAgent: string;
  userId?: string;
}

export interface UpdateSession {
  id: string;
  userId?: string;
  success?: string;
  error?: string;
}

export interface ISession {
  id: string;
  user?: User;
  success?: string;
  error?: string;
}
