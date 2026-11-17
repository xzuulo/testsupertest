import "dotenv/config";

export const PORT = process.env.PORT || 3000;
export const SECRET_KEY = process.env.BETTER_AUTH_SECRET;
export const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017";
