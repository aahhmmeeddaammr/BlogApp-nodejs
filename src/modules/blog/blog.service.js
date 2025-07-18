import { BlogModel } from "../../db/models/Blog.model.js";
import { UserModel } from "../../db/models/User.model.js";
import { paginate } from "../../utils/paginate.js";

export const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;

    const blog = await BlogModel.create({
      title,
      content,
      b_author_id: authorId,
    });

    return res.status(201).json({ message: "Blog created successfully", data: blog });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const listBlogs = async (req, res, next) => {
  const { limit, offset, currentPage } = paginate(req.query);

  try {
    const blogs = await BlogModel.findAndCountAll({
      include: {
        model: UserModel,
        attributes: ["email", "firstName", "lastName", "middleName", "id"],
      },
      limit,
      offset,
    });
    const data = {};
    data.totalPages = Math.ceil(data.count / limit);
    data.currentPage = currentPage;
    data.data = blogs;
    return res.json({ message: "done", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getBlog = async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid blog id" });
  }

  try {
    const blog = await BlogModel.findByPk(id, {
      include: {
        model: UserModel,
        attributes: ["email", "firstName", "lastName", "middleName", "id"],
      },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { title, content, createdAt, updatedAt, user } = blog;

    return res.json({
      message: "done",
      data: {
        id: blog.id,
        title,
        content,
        createdAt,
        updatedAt,
        author: user,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
export const deleteBlog = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    const blog = await BlogModel.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.b_author_id !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this blog" });
    }

    await blog.destroy();

    return res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
export const getBlogsForUser = async (req, res, next) => {
  const authorId = req.user.id;
  const { limit, offset, currentPage } = paginate(req.query);

  try {
    const blogs = await BlogModel.findAndCountAll({
      where: { b_author_id: authorId },
      include: {
        model: UserModel,
        attributes: ["email", "firstName", "lastName", "middleName", "id"],
      },
      limit,
      offset,
    });
    const data = {};
    data.totalPages = Math.ceil(data.count / limit);
    data.currentPage = currentPage;
    data.data = blogs;
    data.totalPages = Math.ceil(data.count / size);
    data.currentPage = currentPage;

    return res.json({ message: "done", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
export const updateBlog = async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const loggedInUserId = req.user.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    const blog = await BlogModel.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.b_author_id !== loggedInUserId) {
      return res.status(403).json({ message: "Unauthorized to update this blog" });
    }

    let updated = false;

    if (title && title.trim() !== blog.b_title) {
      blog.title = title.trim();
      updated = true;
    }

    if (content && content.trim() !== blog.b_content) {
      blog.content = content.trim();
      updated = true;
    }

    if (!updated) {
      return res.status(400).json({ message: "No changes detected in blog data" });
    }

    await blog.save();

    return res.json({ message: "Blog updated successfully", data: blog });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
