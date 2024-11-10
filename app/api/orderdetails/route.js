import { NextResponse } from "next/server";
import CustomerOrder from "../../../models/customerOrder";
import { dbConnect } from "../dbConnect";
import dayjs from "dayjs";

export async function GET(request) {
    await dbConnect(); // Reused MongoDB connection

    const url = new URL(request.url);
    const today = url.searchParams.get("today");
    const lastWeek = url.searchParams.get("lastWeek");
    const lastMonth = url.searchParams.get("lastMonth");

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
    }

    try {
        const ordersWithTables = await CustomerOrder.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: "$order_title",
                    total_quantity: { $sum: "$order_quantity" }
                }
            },
            {
                $sort: { total_quantity: -1 }  // Sort by total_quantity in descending order
            },
            {
                $project: {
                    _id: 0,
                    title: "$_id",
                    total_quantity: 1
                }
            }
        ]);

        // Format the response to a key-value object where keys are titles and values are total quantities
        const result = {};
        ordersWithTables.forEach(order => {
            result[order.title] = order.total_quantity;
        });

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
