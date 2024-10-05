import mongoose, { Schema } from "mongoose";

const billSchema = new Schema(
  {
    originalPrice: Number,
    finalPrice: Number,
    discountPercent: Number,
    remarks: String,
    tablebill_id: String,
    billStatus: String,
    billPaymentMode: String,
    qrAmount: Number,
    cashAmount: Number,
    barPrice: Number,
    kitchenPrice: Number,
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);

export default Bill;