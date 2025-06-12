import mongoose, { Schema } from "mongoose";

const checklistSchema = new Schema(
  {
    name: String,
    isChecked: {
        type: Boolean,
        default: false,
      },
  },
  {
    timestamps: true,
  }
);

const Checklist = mongoose.models.Checklist || mongoose.model("Checklist", checklistSchema);

export default Checklist;