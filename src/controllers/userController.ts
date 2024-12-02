import express, { Request, Response, NextFunction } from "express";
import verifyToken from "../middlewares/authMiddleware";

interface LoginRequestBody {
  email: string;
  password: string;
}
import { PrismaClient, Prisma } from "@prisma/client";

interface SignupRequestBody {
  email: string;
  password: string;
  firstName: string; // Updated to include firstName
  lastName: string; // Updated to include lastName
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
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword, // Hash the password
        firstName: req.body.firstName, // Updated to include firstName
        lastName: req.body.lastName, // Updated to include lastName
        isAdmin: req.body.isAdmin,
        role: req.body.role,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res
        .status(409)
        .send({ error: "Unique constraint failed on the fields: `id`" });
    } else {
      res.status(500).send({ error: "Internal server error" });
    }
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
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        email: req.body.email,
        password: hashedPassword, // Hash the password
        firstName: req.body.firstName, // Updated to include firstName
        lastName: req.body.lastName, // Updated to include lastName
        isAdmin: req.body.isAdmin,
        role: req.body.role,
      },
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
    console.log("Email or password not provided.");
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  try {
    console.log(`Attempting to find user with email: ${email}`);
    const foundUser = await prisma.user.findUnique({ where: { email } });
    if (!foundUser) {
      console.log("User not found.");
      res.status(401).json({ message: "User not found." });
      return;
    }

    console.log("User found:", foundUser);
    console.log("Checking password.");
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
    if (!passwordCorrect) {
      console.log("Password incorrect.");
      res.status(401).json({ message: "Unable to authenticate the user" });
      return;
    }

    console.log("Password correct, generating token.");
    const { id } = foundUser;
    const payload = { id, email };

    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
      console.log("TOKEN_SECRET is not defined.");
      throw new Error("TOKEN_SECRET is not defined");
    }

    const authToken = jwt.sign(payload, tokenSecret, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    console.log("Token generated successfully:", authToken);
    res.status(200).json({ authToken });
  } catch (err) {
    console.error("Error during authentication:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Signup user
export const signupUser = async (
  req: Request<{}, {}, SignupRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password, firstName, lastName, isAdmin = false } = req.body; // Updated to include firstName and lastName

  if (!email || !password || !firstName || !lastName) {
    res
      .status(400)
      .json({ message: "Provide email, password, first name, and last name" });
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
        firstName, // Updated to include firstName
        lastName, // Updated to include lastName
        isAdmin, // Save isAdmin property
      },
    });

    const { id } = createdUser;
    const user = { email, firstName, lastName, id };
    res.status(201).json({ user });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      res
        .status(409)
        .send({ error: "Unique constraint failed on the fields: `id`" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const app = express();

// Admin-protected route for testing
export const adminProtectedRoute = (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome, Admin!" });
};

// Example of a protected route
app.get("/protected-route", verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "This is a protected route." });
});
