import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import CustomerOrder from "../../../models/customerOrder";
import Table from "../../../models/table";

// export async function POST(request) {
//     const { order_title, order_description } = await request.json();
//     await connectMongoDB();
//     await Order.create({ order_title, order_description });
//     return NextResponse.json({ message: "Order created." }, { status: 201 });
// }

// export async function GET() {
//     await connectMongoDB();
//     const orders = await Order.find();
//     return NextResponse.json({orders});
// }

export async function POST(request) {
    const { table_id,order_title, order_description, order_test } = await request.json();
    await connectMongoDB();
    await CustomerOrder.create({table_id, order_title, order_description, order_test });
    return NextResponse.json({ message: "Order created." }, { status: 201 });
}

// export async function GET(request, {params}) {
//     try{
//     const { id } = params;
//     await connectMongoDB();
//     const orders = await Order.findOne({ _id: id });
//     return NextResponse.json({ orders }, { status: 200 });
//     } catch (error) {
//         console.log("Error: ", error);
//     }
// }

export async function GET(request, response) {
    try {
        // Connect to MongoDB
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
            }
        ]);

        // Return the results in the response
        return NextResponse.json({ ordersWithTables }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
    }
}



