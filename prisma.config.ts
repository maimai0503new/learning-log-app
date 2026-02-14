// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // 💡 大工さん（CLI）には、常に直通（5432）を使わせる！
    url: env("DIRECT_URL"), 
  },
});