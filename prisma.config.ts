import { defineConfig } from "prisma/config";
import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

export default defineConfig({
  earlyAccess: true,
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  },
  migrate: {
    adapter: async (env: Record<string, string | undefined>) => {
      const url = env["DATABASE_URL"] || "file:./prisma/dev.db";
      const libsql = createClient({ url });
      return new PrismaLibSQL(libsql);
    },
  },
});
