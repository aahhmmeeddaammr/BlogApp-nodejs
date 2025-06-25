import { Op } from "sequelize";
import { UserModel } from "../../db/models/User.model.js";

export const list = async (req, res, next) => {
  let page = req.query.page ? parseInt(req.query.page) : 1;
  const size = req.query.limit ? parseInt(req.query.limit) : 5;
  page = (page - 1) * size;
  console.log({ page });

  try {
    const data = await UserModel.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit: size,
      offset: page,
    });
    data.totalPages = Math.ceil(data.count / size);
    return res.json({ message: "done", data });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};
export const getById = async (req, res, next) => {
  if (isNaN(req.params.id)) {
    return res.status(400).json({ message: "in-valid Id" });
  }
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "in-valid profile Id" });
    }
    return res.json({ message: "done", data: user });
  } catch (error) {
    return res.status(500).json({ message: "error", error: error.message });
  }
};
export const search = async (req, res, next) => {
  let page = req.query.page ? parseInt(req.query.page) : 1;
  const size = req.query.limit ? parseInt(req.query.limit) : 5;
  page = (page - 1) * size;
  console.log({ page });
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "name param is required" });
  }
  try {
    const users = await UserModel.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit: size,
      offset: page,
      where: {
        [Op.or]: [{ firstName: { [Op.substring]: name } }, { middleName: { [Op.substring]: name } }, { lastName: { [Op.substring]: name } }],
      },
    });
    return res.json({ message: "done", data: users });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const loggedInUserId = req.user.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: "in-valid Id" });
  }
  if (parseInt(id) !== loggedInUserId) {
    return res.status(403).json({ message: "You are not authorized to update this profile" });
  }
  try {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "in-valid account Id" });
    }
    user.destroy();
    return res.json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
export const updateUser = async (req, res, next) => {
  const loggedInUserId = req.user.id;
  const { id } = req.params;
  const { dateOfBirth, firstName, middleName, secondName, gender } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (parseInt(id) !== loggedInUserId) {
    return res.status(403).json({ message: "You are not authorized to update this profile" });
  }
  try {
    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "in-valid account Id" });
    }
    user.update({ dateOfBirth, firstName, middleName, secondName, gender });
    return res.json({ message: "user updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
