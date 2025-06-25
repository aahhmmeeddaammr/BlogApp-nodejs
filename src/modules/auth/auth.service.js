// import { connection } from "../../db/connection.db.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../../db/models/User.model.js";
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({
      where: {
        email,
        password,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "In-valid Email or Password" });
    }
    const payload = {
      id: user.id,
      name: user.fullName,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: "HS256", expiresIn: "1h" });
    return res.json({ message: "user Login successfully", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const signup = async (req, res, next) => {
  const { fullName, password, confirmPassword, email } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Password mis match with confirm password" });
  }
  const checkUser = await UserModel.findOne({
    where: {
      email,
    },
  });
  if (checkUser) {
    return res.status(409).json({ message: "User already exist" });
  }
  try {
    const user = await UserModel.create({ fullName, password, email });
    const userData = user.toJSON();
    delete userData.password;
    return res.status(201).json({ message: "done", user: userData });
  } catch (error) {
    res.status(500).json({ error });
  }
};
export default { login, signup };
