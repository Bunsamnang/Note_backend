import { RequestHandler } from "express";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const jwtSecret = process.env.JWT_SECRET;

interface SignupBody {
  username: string;
  email: string;
  password: string;
}

export const signup: RequestHandler<
  unknown,
  unknown,
  SignupBody,
  unknown
> = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }

    const existingUsername = await UserModel.findOne({ username });

    if (existingUsername) {
      res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await UserModel.findOne({ email });

    if (existingEmail) {
      res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const { _id } = user;

    const userPayload = { _id, username, email };

    jwt.sign(
      userPayload,
      jwtSecret,
      { expiresIn: 3 * 3600 },
      (err: Error | null, token: string | undefined) => {
        if (err) throw err;
        return res.status(201).json({ token });
      }
    );
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email: string;
  password: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).json({ message: "Invalid credentials" });
    } else {
      const { _id, username } = user;

      const userPayLoad = { _id, username, email };

      jwt.sign(
        userPayLoad,
        jwtSecret,
        { expiresIn: 3 * 3600 },
        (err: Error | null, token: string | undefined) => {
          if (err) throw err;
          return res.status(200).json({ token });
        }
      );
    }
  } catch (error) {
    next(error);
  }
};
