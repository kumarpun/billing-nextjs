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
    order_price: Number,
    order_type: String
  },
  {
    timestamps: true,
  }
);

customerOrderSchema.index({ createdAt: 1 });
customerOrderSchema.index({ table_id: 1, customer_status: 1 });

const CustomerOrder = mongoose.models.CustomerOrder || mongoose.model("CustomerOrder", customerOrderSchema);

export default CustomerOrder;