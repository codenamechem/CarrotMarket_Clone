import { PrismaClient } from "@prisma/client";

declare global {
  var client: PrismaClient | undefined;
} // global에 client가 없으니 type 정의

const client = global.client || new PrismaClient();

if (process.env.NODE_ENV === "development") global.client = client;

export default client;
