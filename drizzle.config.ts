import { Config, defineConfig } from 'drizzle-kit'
import "dotenv/config"
export default defineConfig(
    {
        schema: "./db/schema.ts",
        out: "./drizzle",
        dialect: "postgresql",
        dbCredentials: {
            url: process.env.DATABASE_URL || "",
        }
    }
) satisfies Config