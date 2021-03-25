import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

export default {
  port: process.env.PORT!,
  env: process.env.NODE_ENV!,
  jwtSecret: process.env.JWT_SECRET!,
};
