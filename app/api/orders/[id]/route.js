import { NextResponse } from "next/server";
import mongoose from "mongoose";
import CustomerOrder from "../../../../models/customerOrder";
import Bill from "../../../../models/bill";
import { dbConnect } from "../../dbConnect";

export async function GET(request, { params }) {
    const { id } = params;
    await dbConnect(); // Reused MongoDB connection

    try {
        // Single aggregation: fetch orders, compute final_price, and sum totals in DB
        const result = await CustomerOrder.aggregate([
            {
                $match: {
                    table_id: new mongoose.Types.ObjectId(id),
                    customer_status: { $in: ["Customer accepted", "Bill paid"] }
                }
            },
            {
                $addFields: {
                    final_price: { $multiply: ["$order_price", "$order_quantity"] }
                }
            },
            {
                $facet: {
                    orders: [{ $match: {} }],
                    totals: [
                        {
                            $group: {
                                _id: null,
                                total_price: { $sum: { $multiply: ["$order_price", "$order_quantity"] } },
                                totalKitchenPrice: {
                                    $sum: {
                                        $cond: [{ $eq: ["$order_type", "Kitchen"] }, { $multiply: ["$order_price", "$order_quantity"] }, 0]
                                    }
                                },
                                totalBarPrice: {
                                    $sum: {
                                        $cond: [{ $eq: ["$order_type", "Bar"] }, { $multiply: ["$order_price", "$order_quantity"] }, 0]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        const orders = result[0].orders;
        const totals = result[0].totals[0];

        if (!orders || orders.length === 0) {
            return NextResponse.json({
                orderbyTableId: [],
                total_price: 0,
                totalKitchenPrice: 0,
                totalBarPrice: 0,
                tablebill_id: id
            }, { status: 200 });
        }

        return NextResponse.json({
            orderbyTableId: orders,
            total_price: totals?.total_price || 0,
            totalKitchenPrice: totals?.totalKitchenPrice || 0,
            totalBarPrice: totals?.totalBarPrice || 0,
            tablebill_id: id,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Error fetching order' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    const {
        newOrderTitle,
        newOrderDescription,
        newOrderStatus,
        newCustomerStatus,
        newOrderQuantity
    } = await request.json();
    await dbConnect(); // Reused MongoDB connection

    try {
        if (newOrderTitle || newOrderDescription || newOrderStatus || newOrderQuantity) {
            // Update specific order by ID
            const updateData = {};
            if (newOrderTitle) updateData.order_title = newOrderTitle;
            if (newOrderDescription) updateData.order_description = newOrderDescription;
            if (newOrderStatus) updateData.order_status = newOrderStatus;
            if (newOrderQuantity) updateData.order_quantity = newOrderQuantity; // Update order_quantity

            const updatedOrder = await CustomerOrder.findByIdAndUpdate(id, updateData, { new: true });
            if (!updatedOrder) {
                return NextResponse.json({ message: 'Order not found' }, { status: 404 });
            }

            return NextResponse.json({ message: "Order updated successfully", updatedOrder }, { status: 200 });
        }

        if (newCustomerStatus) {
            // Update customer status for all orders with the given table_id
            const updateResult = await CustomerOrder.updateMany(
                { table_id: id, customer_status: { $in: ["Customer accepted", "Bill paid", "Customer left"] } },
                { $set: { customer_status: newCustomerStatus } }
            );

            // When customer leaves, archive bills so next session starts fresh
            if (newCustomerStatus === "Customer left") {
                await Bill.updateMany(
                    { tablebill_id: id, billStatus: { $in: ["pending", "paid"] } },
                    { $set: { billStatus: "completed" } }
                );
            }

            if (updateResult.matchedCount === 0) {
                return NextResponse.json({ message: 'No orders found for this table' }, { status: 404 });
            }

            return NextResponse.json({ message: "Customer status updated successfully", updateResult }, { status: 200 });
        }

        return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    await dbConnect();

    try {
        const deletedOrder = await CustomerOrder.findByIdAndDelete(id);
        
        if (!deletedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "Order deleted successfully",
            deletedOrder: {
                id: deletedOrder._id,
                title: deletedOrder.order_title,
                table_id: deletedOrder.table_id
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting order:', error);
        return NextResponse.json({ error: 'Error deleting order' }, { status: 500 });
    }
}