import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    remarks: String,
    date: Date
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;