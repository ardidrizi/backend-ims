import { Request, Response, NextFunction } from "express";

interface LoginRequestBody {
  email: string;
  password: string;
}
import { PrismaClient } from "@prisma/client";

interface SignupRequestBody {
  email: string;
  password: string;
  name: string;
  isAdmin?: boolean; // Add isAdmin property
}
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

const saltRounds = 10;

const prisma = new PrismaClient();

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all users
export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.send(users);
  } catch (error) {
    res.status(500).send(error); // Fix the missing function call
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });
    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a user by ID
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a user by ID
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// "/login" route
export const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  try {
    const foundUser = await prisma.user.findUnique({ where: { email } });
    if (!foundUser) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
    if (!passwordCorrect) {
      res.status(401).json({ message: "Unable to authenticate the user" });
      return;
    }

    const { id, name = "" } = foundUser; // Handle optional name property
    const payload = { id, email, name };

    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      throw new Error("TOKEN_SECRET is not defined");
    }

    const authToken = jwt.sign(payload, tokenSecret, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Signup user
export const signupUser = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, name, isAdmin = false } = req.body; // Default isAdmin to false

  if (!email || !password || !name) {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  try {
    const foundUser = await prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isAdmin, // Save isAdmin property
      },
    });

    const { id } = createdUser;
    const user = { email, name, id };
    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Admin-protected route for testing
export const adminProtectedRoute = (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome, Admin!" });
};
