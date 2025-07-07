import express from "express";
import { establishDBConnection, syncDBConnection } from "./db/connection.db.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import blogController from "./modules/blog/blog.controller.js";
import { configDotenv } from "dotenv";
export async function bootstrap() {
  const app = express();
  const port = process.env.PORT || 3000;
  const host = "0.0.0.0";
  configDotenv();

  app.use(express.json());

  // DB Connection
  await establishDBConnection(); // ensure the DB is connected
  await syncDBConnection();

  // ========================== End Points ==========================
  app.get("/", (req, res, next) => {
    res.json({ message: "welcome in blog app api" });
  });

  app.use("/api/v1/auth", authController);
  app.use("/api/v1/user", userController);
  app.use("/api/v1/blog", blogController);

  app.listen(port, host, () => {
    console.log(`listening on http://${host}:${port}`);
  });
}
