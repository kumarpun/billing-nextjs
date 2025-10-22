import mongoose, { Schema } from "mongoose";

const menuSchema = new Schema(
  {
    value: String,
    label: String,
    price: Number,
    order_type: String
  },
  {
    timestamps: true,
  }
);

const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);

export default Menu;