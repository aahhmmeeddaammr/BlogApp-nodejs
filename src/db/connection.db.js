import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("blogApp", "root", "Ahmed123", {
  host: "localhost",
  dialect: "mysql",
  port: "3306",
  logging: console.log,
});

export const establishDBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const syncDBConnection = async () => {
  try {
    const result = await sequelize.sync({ alter: false, force: false });
    console.log({ result });
    console.log("Success to sync ");
  } catch {
    console.log("Falied to connection");
  }
};
