import "dotenv/config";
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { PORT, SECRET_KEY } from "./config.js";
import { admin } from "better-auth/plugins";

const baseURL = `http://localhost:${PORT}`;

export const auth = betterAuth({
  database: new Database("database.sqlite"),
  emailAndPassword: {
    enabled: true,
  },
  secret: SECRET_KEY,
  baseURL: baseURL,
  trustedOrigins: ["http://localhost:5173"],
  plugins: [admin()],
});
