import { RequestHandler } from "express";
import NoteModel from "../models/noteModel";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

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

    res.status(201).json({ message: "Note added successfully", data: note });
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const { newTitle, newText } = req.body;

    if (!isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    (note.title = newTitle), (note.text = newText), await note.save();

    res.status(200).json({ message: "Note updated successfully", data: note });
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const noteId = req.params.id;

    if (!isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note ID");
    }

    const note = await NoteModel.findByIdAndDelete(noteId);

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json({ message: "Note deleted successfully", data: note });
  } catch (error) {
    next(error);
  }
};
