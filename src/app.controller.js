import express from "express";
import { establishDBConnection } from "./db/connection.db.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import blogController from "./modules/blog/blog.controller.js";
import { configDotenv } from "dotenv";
export function bootstrap() {
  const app = express();
  const port = process.env.PORT || 3000;
  const host = "0.0.0.0";

  configDotenv();
  app.use(express.json());

  // DB Connection
  establishDBConnection();

  // ========================== End Points ==========================
  app.get("/", (req, res, next) => {
    res.json({ message: "welcome in blog app api" });
  });

  app.use("/auth", authController);
  app.use("/user", userController);
  app.use("/blog", blogController);

  app.all("{/*dummy}", (req, res, next) => {
    return res.status(404).json({ message: "In-valid url or method" });
  });

  app.listen(port, host, () => {
    console.log(`listening on http://${host}:${port}`);
  });
}
