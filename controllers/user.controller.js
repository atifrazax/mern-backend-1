import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import env from "dotenv";
env.config();

const csrf = async (req, res) => {
  try {
    res.json({ csrfToken: req.csrfToken() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const newUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role }); // validation check would be handled by mongoose scheme
    if (user) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(400).json({ message: "User creation failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({ message: "Please enter all the fields" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user && user.role !== role)
      return res.status(401).json({ message: "Unauthorized role" });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "6h",
        }
      );
      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 6 * 60 * 60 * 1000,
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({ message: "Login Successful" });
    } else {
      res.status(401).json({ message: "Login failed, invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const profile = (req, res) =>
  res.status(200).json({ message: "Welcome", user: req.user });

const logout = (req, res) => {
  res.status(200).clearCookie("token").json({ message: "Logout successful" });
};

export default { newUser, signIn, profile, logout, csrf };
