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
    isMl: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ date: 1 });
inventorySchema.index({ createdAt: 1 });

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
export { Inventory };