import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Whether a real database is configured. When false (or unreachable) the data
 * layer transparently falls back to the in-memory synthetic dataset so the app
 * runs out of the box without any infrastructure.
 */
export const isDatabaseConfigured = (): boolean => {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("user:password@localhost")) return false; // .env.example default
  return url.startsWith("postgres");
};
