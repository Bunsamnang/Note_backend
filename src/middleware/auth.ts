import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");

  if (!token) {
    res.status(401).json({ message: "Access denied" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
