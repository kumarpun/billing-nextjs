import mongoose, { Schema } from "mongoose";

const inventorySchema = new Schema(
  {
    title: String,
    quantity: Number,
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;