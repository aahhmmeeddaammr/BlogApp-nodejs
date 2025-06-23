import { connection } from "../../db/connection.db.js";

export const createBlog = (req, res, next) => {
  const { title, content } = req.body;
  const autherId = req.user.id;
  const checkQuery = `SELECT * FROM users WHERE u_id = ?`;
  connection.execute(checkQuery, [autherId], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal server Error", error });
    }
    if (!data.length) {
      return res.status(404).json({ message: "in-valid author id" });
    }
    const insertionQuery = `INSERT INTO blogs (b_title , b_content , b_author_id) values(?,?,?)`;
    connection.execute(insertionQuery, [title, content, autherId], (error, data) => {
      if (error) {
        return res.status(500).json({ message: "Internal server Error", error });
      }
      return res.json({ message: "done", data });
    });
  });
};
export const listBlogs = (req, res, next) => {
  const sqlQuery = `SELECT blogs.* , u_id as id , concat(u_firstName ,' ', u_middleName ,' ',u_lastName ,' ') as fullName , u_email as email 
                    FROM users inner join blogs on users.u_id = blogs.b_author_id`;
  connection.execute(sqlQuery, (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal server Error", error });
    }
    const formattedData = data.map((row) => {
      const { id, fullName, email, ...blogData } = row;
      return {
        ...blogData,
        author: {
          id,
          fullName,
          email,
        },
      };
    });
    return res.json({ message: "done", data: formattedData });
  });
};
export const getBlog = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "In-valid blog id" });
  }
  const sqlQuery = `SELECT blogs.* , u_id as id , concat(u_firstName ,' ', u_middleName ,' ',u_lastName ,' ') as fullName , u_email as email 
                    FROM users inner join blogs on users.u_id = blogs.b_author_id and b_id=?
                    `;
  connection.execute(sqlQuery, [id], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal server Error", error });
    }
    if (!data.length) {
      return res.status(404).json({ message: "In-valid blog id" });
    }
    const formattedData = data.map((row) => {
      const { id, fullName, email, ...blogData } = row;
      return {
        ...blogData,
        author: {
          id,
          fullName,
          email,
        },
      };
    });
    return res.json({ message: "done", data: formattedData });
  });
};
export const deleteBlog = (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const checkQuery = `SELECT * FROM blogs where b_id=?`;
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  connection.execute(checkQuery, [id], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "internal server error", error });
    }
    if (!data.length) {
      return res.status(404).json({ message: "in-valid blog id" });
    }
    if (data[0].b_author_id !== userId) {
      return res.status(401).json({ message: "unauthorized to delete this blog" });
    }

    const deleteQuery = `DELETE FROM blogs WHERE b_id=?`;
    connection.execute(deleteQuery, [id], (error, data) => {
      if (error) {
        return res.status(500).json({ message: "internal server error", error });
      }
      return res.json({ message: "blog deleted successfully", data });
    });
  });
};
export const getBlogsForUser = (req, res, next) => {
  const authorId = req.user.id;
  const sqlQuery = `SELECT blogs.* , u_id as id , concat(u_firstName ,' ', u_middleName ,' ',u_lastName ,' ') as fullName , u_email as email 
                    FROM users inner join blogs on users.u_id = blogs.b_author_id and users.u_id = ?`;
  connection.execute(sqlQuery, [authorId], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal server Error", error });
    }
    const formattedData = data.map((row) => {
      const { id, fullName, email, ...blogData } = row;
      return {
        ...blogData,
        author: {
          id,
          fullName,
          email,
        },
      };
    });
    return res.json({ message: "done", data: formattedData });
  });
};
export const updateBlog = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const loggedInUserId = req.user.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  const checkQuery = `SELECT * FROM blogs WHERE b_id = ?`;
  connection.execute(checkQuery, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }

    const blog = results[0];
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.b_author_id !== loggedInUserId) {
      return res.status(403).json({ message: "You are not authorized to update this blog" });
    }

    const updatedFields = [];
    const updateValues = [];

    const updatedTitle = title?.trim() || blog.b_title;
    if (updatedTitle !== blog.b_title) {
      updatedFields.push("b_title = ?");
      updateValues.push(updatedTitle);
    }

    const updatedContent = content?.trim() || blog.b_content;
    if (updatedContent !== blog.b_content) {
      updatedFields.push("b_content = ?");
      updateValues.push(updatedContent);
    }

    if (!updatedFields.length) {
      return res.status(400).json({ message: "No changes detected in blog data" });
    }

    const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    updatedFields.push("b_updatedAt = ?");
    updateValues.push(updatedAt);

    const updateQuery = `UPDATE blogs SET ${updatedFields.join(", ")} WHERE b_id = ?`;
    updateValues.push(id);

    connection.execute(updateQuery, updateValues, (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Internal server error", error });
      }
      return res.status(200).json({ message: "Blog updated successfully" });
    });
  });
};
