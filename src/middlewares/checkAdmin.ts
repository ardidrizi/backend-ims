import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

export const checkAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const tokenSecret = process.env.TOKEN_SECRET as string | undefined;
    if (!tokenSecret) {
      throw new Error("TOKEN_SECRET is not defined");
    }

    const decoded = jwt.verify(token, tokenSecret) as unknown as {
      isAdmin: boolean;
    };
    if (!decoded.isAdmin) {
      res.status(403).json({ message: "Forbidden: Admins only" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
