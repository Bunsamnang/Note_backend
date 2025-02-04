import { RequestHandler } from "express";
import NoteModel from "../models/noteModel";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const createNote: RequestHandler = async (req, res, next) => {
  try {
    const { title, text } = req.body;
    if (!title) {
      res.status(400).json({ message: "Title is required" });
    }

    const note = await NoteModel.create({
      title,
      text: text || "",
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};
