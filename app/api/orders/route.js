import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import CustomerOrder from "../../../models/customerOrder";
import Table from "../../../models/table";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export async function POST(request) {
    const { table_id,order_title, order_description, order_test, order_status, customer_status, order_quantity, order_price } = await request.json();
    await connectMongoDB();
    await CustomerOrder.create({table_id, order_title, order_description, order_test, order_status, customer_status, order_quantity, order_price});
    return NextResponse.json({ message: "Order created successfully." }, { status: 201 });
}

export async function GET(request, response) {
    try {
        // const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        // if (!token) {
        //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }
        await connectMongoDB();

        // Perform aggregation or $lookup operation to join CustomerOrder with Table
        const ordersWithTables = await CustomerOrder.aggregate([
            {
                $lookup: {
                    from: "tables", // Collection name of the Table model
                    localField: "table_id",
                    foreignField: "_id",
                    as: "table"
                }
            },
            {
                $addFields: {
                    total_price: { $multiply: ["$order_price", "$order_quantity"] }
                }
            },
            {
                $group: {
                    _id: null,
                    total_bill: { $sum: "$total_price" },
                    orders: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    total_bill: 1,
                    orders: 1
                }
            }
        ]);

        // Return the results in the response
        return NextResponse.json({ ordersWithTables }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await CustomerOrder.findByIdAndDelete(id);
    return NextResponse.json({ message: "Order deleted." });
}


