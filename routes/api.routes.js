import express from "express";
import userController from "../controllers/user.controller.js";
import adminController from "../controllers/admin.controller.js";
import auth from "../middlewares/auth.middleware.js";
import csrfProtection from "../utils/csrfProtection.js";

const router = express.Router();
// User routes
router.post("/signin", userController.signIn);
router.get("/csrf", csrfProtection, userController.csrf);
router.post("/signup", csrfProtection, userController.newUser);
router.get("/profile", auth, userController.profile);
router.post("/logout", userController.logout);

// Admin routes
router.post("/admin", adminController.adminSignin); // Admin Signin

export default router;
