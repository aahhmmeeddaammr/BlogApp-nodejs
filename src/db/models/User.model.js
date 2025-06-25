import { DataTypes } from "sequelize";
import { sequelize } from "../connection.db.js";

export const UserModel = sequelize.define(
  "user",
  {
    firstName: {
      type: DataTypes.STRING,
      field: "u_firstName",
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    middleName: {
      type: DataTypes.STRING,

      field: "u_middleName",
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      field: "u_lastName",
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue("firstName", value.split(" ")[0]);
        this.setDataValue("middleName", value.split(" ")[1]);
        this.setDataValue("lastName", value.split(" ")[2]);
      },
      get() {
        return this.getDataValue("firstName") + " " + this.getDataValue("lastName");
      },
    },
    password: {
      type: DataTypes.STRING,
      field: "u_password",
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      field: "u_email",
      allowNull: false,
      unique: true,
    },
    confirmEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "u_confirmEmail",
      allowNull: false,
    },
    DOB: {
      type: DataTypes.DATE,
      field: "u_DOB",
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      defaultValue: "male",
      field: "u_gender",
      allowNull: true,
    },
  },
  {}
);
