import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "❌ Please add your full name"],
      trim: true,
      minlength: [3, "❌ Name must be at least 3 characters long"],
      maxlength: [25, "❌ Name must be at most 25 characters long"],
      match: [/^[A-Za-z\s]+$/, "❌ Name can contain alphabets only"], // alphabets & spaces only
    },
    email: {
      type: String,
      required: [true, "❌ Please add an email"],
      unique: [true, "❌ Email already exists"],
      match: [/.+\@.+\..+/, "❌ Please enter a valid email"],
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "❌ Please add a password"],
      minlength: [4, "❌ Password must be at least 4 characters long"],
      maxlength: [15, "❌ Password must be at most 15 characters long"],
    },
    role: {
      type: String,
      required: [true, "❌ Please add a role"],
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash password before saving into database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
