import { connection } from "../../db/connection.db.js";

export const list = (req, res, next) => {
  const getAllUsersQuery = `SELECT u_id as id , concat(u_firstName ,' ', u_middleName ,' ',u_lastName ,' ') as fullName , u_email as email ,u_DOB as dateOfBirth , u_gender as gender , u_createdAt as createdAt , u_updatedAt as updatedAt FROM users`;
  connection.execute(getAllUsersQuery, (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.json({ message: "done", data });
  });
};
export const getById = (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: "in-valid Id" });
  }
  const getUserQuery = `SELECT u_id as id , concat(u_firstName ,' ', u_middleName ,' ',u_lastName ,' ') as fullName , u_email as email ,u_DOB as dateOfBirth , u_gender as gender , u_createdAt as createdAt , u_updatedAt as updatedAt FROM users where u_id = ?`;
  connection.execute(getUserQuery, [req.params.id], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    if (!data.length) {
      return res.status(404).json({ message: "in-valid profile Id" });
    }
    return res.json({ message: "done", data: data[0] });
  });
};
export const search = (req, res, next) => {
  console.log("asckmlks");

  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "name param is required" });
  }
  const sql = `SELECT u_id as id , concat(u_firstName ,' ', u_middleName ,' ',u_lastName ,' ') as fullName , u_email as email ,u_DOB as dateOfBirth , u_gender as gender , u_createdAt as createdAt , u_updatedAt as updatedAt FROM users having fullName like ?`;
  connection.execute(sql, [`%${name}%`], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    return res.json({ message: "done", data });
  });
};
export const deleteUser = (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ message: "in-valid Id" });
  }
  const select = `SELECT * from users where u_id = ?`;
  connection.execute(select, [id], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    if (!data.length) {
      return res.status(404).json({ message: "in-valid profile Id" });
    }
    const getUserQuery = `DELETE FROM users where u_id = ?`;
    connection.execute(getUserQuery, [id], (error, data) => {
      if (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
      }
      return res.json({ message: "done", data });
    });
  });
};
export const updateUser = (req, res, next) => {
  const loggedInUserId = req.user.id;
  const { id } = req.params;
  const { dateOfBirth, firstName, middleName, secondName, gender } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (parseInt(id) !== loggedInUserId) {
    return res.status(403).json({ message: "You are not authorized to update this profile" });
  }

  const updateFields = [];
  const updateValues = [];

  if (firstName) {
    updateFields.push("u_firstName = ?");
    updateValues.push(firstName.trim());
  }
  if (middleName) {
    updateFields.push("u_middleName = ?");
    updateValues.push(middleName.trim());
  }
  if (secondName) {
    updateFields.push("u_lastName = ?");
    updateValues.push(secondName.trim());
  }
  if (gender) {
    updateFields.push("u_gender = ?");
    updateValues.push(gender.trim());
  }
  if (dateOfBirth) {
    updateFields.push("u_DOB = ?");
    updateValues.push(dateOfBirth);
  }

  if (!updateFields.length) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  const updateQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE u_id = ?`;
  updateValues.push(loggedInUserId); // add ID to end for WHERE

  connection.execute(updateQuery, updateValues, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error", error: err });
    }

    return res.status(200).json({ message: "User profile updated successfully" });
  });
};
