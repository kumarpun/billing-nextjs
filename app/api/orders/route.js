import { NextResponse } from "next/server";
import CustomerOrder from "../../../models/customerOrder";
import dayjs from "dayjs";
import { dbConnect } from "../dbConnect";

export async function POST(request) {
    try {
      const data = await request.json();
      await dbConnect();
  
      // Handle both single and multiple order submissions
      if (Array.isArray(data)) {
        await CustomerOrder.insertMany(data);
        return NextResponse.json({ message: "Multiple orders created successfully." }, { status: 201 });
      } else {
        await CustomerOrder.create(data);
        return NextResponse.json({ message: "Single order created successfully." }, { status: 201 });
      }
  
    } catch (error) {
      console.error("Error creating order:", error);
      return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
    }
  }

export async function GET(request) {
    await dbConnect(); // Reused MongoDB connection
    
    const url = new URL(request.url);
    const today = url.searchParams.get("today");
    const lastWeek = url.searchParams.get("lastWeek");
    const lastMonth = url.searchParams.get("lastMonth");
    const custom = url.searchParams.get("custom");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const matchStage = {};

    // Determine the date range based on the filter
    if (today === "true") {
        const startOfToday = dayjs().startOf('day').toDate();
        const endOfToday = dayjs().endOf('day').toDate();
        matchStage.createdAt = { $gte: startOfToday, $lte: endOfToday };
    } else if (lastWeek === "true") {
        const oneWeekAgo = dayjs().subtract(7, 'day').startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();
        matchStage.createdAt = { $gte: oneWeekAgo, $lte: todayEnd };
    } else if (lastMonth === "true") {
        const oneMonthAgo = dayjs().subtract(1, 'month').startOf('day').toDate();
        const todayEnd = dayjs().endOf('day').toDate();
        matchStage.createdAt = { $gte: oneMonthAgo, $lte: todayEnd };
    } else if (custom === "true" && startDate && endDate) {
        const start = dayjs(startDate).startOf("day").toDate(); // Adjust start to start of day
        const end = dayjs(endDate).endOf("day").toDate();       // Adjust end to end of day
        matchStage.createdAt = { $gte: start, $lte: end };
    }

    try {
        const ordersWithTables = await CustomerOrder.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "tables",
                    localField: "table_id",
                    foreignField: "_id",
                    as: "table",
                    pipeline: [{ $project: { title: 1 } }]
                }
            },
            {
                $addFields: {
                    total_price: { $multiply: ["$order_price", "$order_quantity"] }
                }
            },
            {
                $project: {
                    order_title: 1, order_price: 1, order_quantity: 1,
                    order_type: 1, customer_status: 1, table_id: 1,
                    table: 1, total_price: 1, createdAt: 1
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

        return NextResponse.json({ ordersWithTables }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect();
    try {
        const deleted = await CustomerOrder.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Order deleted." });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting order" }, { status: 500 });
    }
}
