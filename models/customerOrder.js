import mongoose, { Schema } from "mongoose";

const customerOrderSchema = new Schema(
  {
    table_id: {
        type: Schema.Types.ObjectId,
        ref: "Table"
    },
    order_title: String,
    order_description: String,
    order_test: String,
    order_status: String,
    customer_status: String,
    order_quantity: Number,
    order_price: Number
  },
  {
    timestamps: true,
  }
);

const CustomerOrder = mongoose.models.CustomerOrder || mongoose.model("CustomerOrder", customerOrderSchema);

export default CustomerOrder;