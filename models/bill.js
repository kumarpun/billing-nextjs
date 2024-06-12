import mongoose, { Schema } from "mongoose";

const billSchema = new Schema(
  {
    originalPrice: Number,
    finalPrice: Number,
    discountPercent: Number,
    remarks: String,
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);

export default Bill;