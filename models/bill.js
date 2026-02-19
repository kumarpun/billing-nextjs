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

billSchema.index({ createdAt: 1 });
billSchema.index({ tablebill_id: 1, billStatus: 1 });

const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);

export default Bill;