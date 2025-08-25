import mongoose, { Schema } from "mongoose";

const creditSchema = new Schema(
  {
    name: String,
    date: Date,
    amount: Number,
    paid: {
      type: Boolean,
      default: false,
    },
    remarks: String
  },
  {
    timestamps: true,
  }
);

const Credit = mongoose.models.Credit || mongoose.model("Credit", creditSchema);

export default Credit;