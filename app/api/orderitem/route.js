import { NextResponse } from "next/server";
import CustomerOrder from "../../../models/customerOrder";
import { dbConnect } from "../dbConnect";

// Helper function to get date ranges for filters
const getDateRange = (filter) => {
    const today = new Date();
    let startDate;

    switch (filter) {
        case "today":
            startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            break;
        case "last_week":
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 7);
            break;
        case "last_month":
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 1);
            break;
        default:
            return null;
    }
    return { startDate, endDate: today };
};

export async function POST(request) {
    try {
        await dbConnect();
        
        // Parse the request body to get the search query and filter type
        const { order_title, filter } = await request.json();

        // Get the date range based on the filter type
        const dateRange = getDateRange(filter);

        // Create the match condition
        const matchCondition = {
            ...order_title ? { order_title: { $regex: order_title, $options: "i" } } : {},
            ...dateRange ? { createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate } } : {}
        };

        // Perform aggregation with a search filter by order_title and date range
        const ordersCount = await CustomerOrder.aggregate([
            {
                $match: matchCondition
            },
            {
                $count: "count" // Count the number of matching documents
            }
        ]);

        // Return the count in the response
        const count = ordersCount[0]?.count || 0;
        return NextResponse.json({ count }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Error occurred" }, { status: 500 });
    }
}
