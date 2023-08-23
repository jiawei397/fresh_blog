import { SessionMiddleware } from "@/modules/session/session.middleware.ts";

export const handler = [
  SessionMiddleware,
];
