import { connection } from "../../db/connection.db.js";
import jwt from "jsonwebtoken";
const login = (req, res, next) => {
  const { email, password } = req.body;
  const isExistQuery = "SELECT * from users where u_email=? and u_password=?";
  connection.execute(isExistQuery, [email, password], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    if (!data.length) {
      return res.status(404).json({ message: "In-valid Email or Password" });
    }
    const payload = {
      id: data[0].u_id,
      name: data[0].u_firstName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
    return res.json({ message: "user Login successfully", token });
  });
};

const signup = (req, res, next) => {
  const { firstName, middleName, lastName, password, confirmPassword, email } = req.body;
  console.log({ firstName, middleName, lastName, password, confirmPassword, email });

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password mis match with confirm password" });
  }
  const isExistQuery = "SELECT * from users where u_email=?";
  connection.execute(isExistQuery, [email], (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
    if (data.length) {
      return res.status(409).json({ message: "User already exist" });
    }
    const insertionQuery = `INSERT INTO users(u_firstName , u_middleName,u_lastName,u_password,u_email) values(?,?,?,?,?)`;
    connection.execute(insertionQuery, [firstName, middleName, lastName, password, email], (error, data) => {
      if (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
      }
      return res.status(201).json({ data });
    });
  });
};
export default { login, signup };
