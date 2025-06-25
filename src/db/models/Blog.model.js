import { DataTypes } from "sequelize";
import { sequelize } from "../connection.db.js";
import { UserModel } from "./User.model.js";

export const BlogModel = sequelize.define("Blog", {
  id: {
    field: "b_id",
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  content: {
    field: "b_content",
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [10, 200],
    },
  },
  title: {
    field: "b_title",
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 40],
    },
  },
});
BlogModel.belongsTo(UserModel, {
  foreignKey: "b_author_id",
});
