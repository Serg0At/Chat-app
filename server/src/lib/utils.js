import jwt from "jsonwebtoken";
import config from "../configs/variables.config";

const { AUTH } = config

export const generateToken = (userId, res) => {
  const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = AUTH;
  if (!JWT_REFRESH_SECRET || JWT_ACCESS_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const accessToken = jwt.sign({ userId }, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "strict", // CSRF attacks
    secure: ENV.NODE_ENV === "development" ? false : true,
  });

  return { accessToken, refreshToken };
};
