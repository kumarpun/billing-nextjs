import mongoose, { Schema } from "mongoose";

const tableSchema = new Schema(
  {
    title: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const Table = mongoose.models.Table || mongoose.model("Table", tableSchema);

export default Table;