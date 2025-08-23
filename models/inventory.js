import mongoose, { Schema } from "mongoose";

const inventorySchema = new Schema(
  {
    title: String,
    ml: Number,
    bottle: String,
    category: String,
    threshold: Number,
    opening: Number,
    received: Number,
    sales: Number,
    closing: String,
    manualOrderAdjustment: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
export { Inventory };