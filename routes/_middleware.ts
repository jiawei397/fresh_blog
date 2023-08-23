import { SessionMiddleware } from "@/session/session.middleware.ts";

export const handler = [
  SessionMiddleware,
];
