import dotenv from "dotenv";
dotenv.config();

// Kiểm tra xem database có phải local hay không
const isLocalDb =
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes("localhost") ||
  process.env.DATABASE_URL.includes("127.0.0.1");

// Nếu chạy local DB -> ssl: false; Nếu cloud (Supabase, Neon, v.v.) -> ssl: { rejectUnauthorized: false }
// Có thể tùy chỉnh rõ ràng bằng biến môi trường DB_SSL (true/false)
const useSsl =
  process.env.DB_SSL !== undefined
    ? process.env.DB_SSL === "true"
    : !isLocalDb;

const baseConfig = {
  client: "pg",
  connection: {
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/smart_restaurant",
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  },
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeders",
  },
};

export default {
  development: baseConfig,
  production: {
    ...baseConfig,
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
  },
};
