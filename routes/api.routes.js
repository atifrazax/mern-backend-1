import express from "express";
import userController from "../controllers/user.controller.js";
import auth from "../middlewares/auth.middleware.js";
import csrfProtection from "../utils/csrfProtection.js";

const router = express.Router();

router.post("/signin", userController.signIn);
router.get("/csrf", csrfProtection, userController.csrf);
router.post("/signup", csrfProtection, userController.newUser);
router.get("/profile", auth, userController.profile);
router.get("/logout", userController.logout);

export default router;
