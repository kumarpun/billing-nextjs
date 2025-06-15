import mongoose, { Schema } from "mongoose";

const dutySchema = new Schema(
  {
    name: String,
    shift: String,
    date: Date,
    designation: String,
    leave: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Duty = mongoose.models.Duty || mongoose.model("Duty", dutySchema);

export default Duty;