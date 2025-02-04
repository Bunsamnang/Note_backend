import express from "express";
import { createNote, getNotes } from "../controllers/noteController";

const router = express.Router();

router.get("/", getNotes);

router.post("/", createNote);

export default router;
