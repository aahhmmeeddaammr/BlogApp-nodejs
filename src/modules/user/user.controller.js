import { Router } from "express";
import * as userService from "./user.service.js";
import { connection } from "../../db/connection.db.js";
import { verifyToken } from "../../middlewares/verifiytoken.middleware.js";
const router = Router();

router.get("/", userService.list);
router.get("/search", userService.search);
router.get("/:id", userService.getById);
router.delete("/:id", verifyToken, userService.deleteUser);
router.patch("/:id", verifyToken, userService.updateUser);

export default router;
