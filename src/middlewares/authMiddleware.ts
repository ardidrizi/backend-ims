import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

// Extend the Request interface to include the user property
interface AuthenticatedRequest extends Request {
  user?: User;
}

// ...existing code...

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res
        .status(500)
        .send({ error: "Internal server error. JWT secret is not defined." });
      return;
    }
    const decoded = jwt.verify(token, secret) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.id) },
    });

    if (!user) {
      res.status(404).send({ error: "User not found." });
    }

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).send({ error: "User not found." });
    }
  } catch (ex) {
    next(ex);
  }
};

export default authMiddleware;

// ...existing code...
