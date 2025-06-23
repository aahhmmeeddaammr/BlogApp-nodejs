import { Router } from "express";
import * as blogService from "./blog.service.js";
import { verifyToken } from "../../middlewares/verifiytoken.middleware.js";

const router = Router();

router.post("/", verifyToken, blogService.createBlog);
router.get("/", blogService.listBlogs);
router.get("/myblog", verifyToken, blogService.getBlogsForUser);
router.get("/:id", blogService.getBlog);
router.delete("/:id", verifyToken, blogService.deleteBlog);
router.patch("/:id", verifyToken, blogService.updateBlog);

export default router;
