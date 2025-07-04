import mongoose, { Schema } from "mongoose";

const priceSchema = new Schema(
  {
    title: String,
    quantity: String,
    price: Number,
  },
  {
    timestamps: true,
  }
);

const Price = mongoose.models.Price || mongoose.model("Price", priceSchema);

export default Price;