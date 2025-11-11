import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please enter all the fields" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Admin not found." });

    if (user && user.role !== "admin")
      return res.status(401).json({ message: "Unauthorized." });

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
        .json({ message: "Sign-In Successful" });
    } else {
      res.status(401).json({ message: "Sign-In failed, invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { adminSignin };
