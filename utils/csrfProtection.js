import csurf from "csurf";
import env from "dotenv";
env.config();

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

export default csrfProtection;
