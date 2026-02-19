import { NextResponse } from "next/server";
import Table from "../../../models/table";
import CustomerOrder from "../../../models/customerOrder";
import { dbConnect } from "../dbConnect";

export async function POST(request) {
    const { title, description } = await request.json();
    await dbConnect();
    await Table.create({ title, description });
    return NextResponse.json({ message: "Table created." }, { status: 201 });
}

export async function GET(request) {
    await dbConnect();
    try {
        const url = new URL(request.url);
        const withOrders = url.searchParams.get("withOrders");

        const tables = await Table.find().lean();

        if (withOrders === "true") {
            // Single aggregation to get order counts + totals for ALL tables at once
            const orderSummaries = await CustomerOrder.aggregate([
                {
                    $match: {
                        customer_status: { $in: ["Customer accepted", "Bill paid"] }
                    }
                },
                {
                    $group: {
                        _id: "$table_id",
                        orderCount: { $sum: 1 },
                        totalPrice: { $sum: { $multiply: ["$order_price", "$order_quantity"] } },
                        orders: {
                            $push: {
                                _id: "$_id",
                                order_title: "$order_title",
                                order_price: "$order_price",
                                order_quantity: "$order_quantity",
                                order_type: "$order_type",
                                customer_status: "$customer_status",
                                final_price: { $multiply: ["$order_price", "$order_quantity"] }
                            }
                        }
                    }
                }
            ]);

            // Build a lookup map: tableId -> summary
            const summaryMap = {};
            for (const s of orderSummaries) {
                summaryMap[s._id.toString()] = s;
            }

            // Merge into tables
            const tablesWithOrders = tables.map(table => {
                const summary = summaryMap[table._id.toString()];
                return {
                    ...table,
                    orders: {
                        orderbyTableId: summary ? summary.orders : [],
                        total_price: summary?.totalPrice || 0,
                        tablebill_id: table._id.toString(),
                    },
                    totalPrice: summary?.totalPrice || 0,
                };
            });

            return NextResponse.json({ tables: tablesWithOrders });
        }

        return NextResponse.json({ tables });
    } catch (error) {
        console.error("Error fetching tables:", error);
        return NextResponse.json({ error: "Error fetching tables" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect();
    try {
        const deleted = await Table.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Table not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Table deleted." });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting table" }, { status: 500 });
    }
}