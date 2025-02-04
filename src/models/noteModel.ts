import { InferSchemaType, model, Schema } from "mongoose";

const NoteSchema = new Schema(
  {
    title: { required: true, type: String },
    text: { type: String },
  },
  { timestamps: true }
);

type Note = InferSchemaType<typeof NoteSchema>;
export default model<Note>("note", NoteSchema);
