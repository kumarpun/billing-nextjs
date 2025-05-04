import { NextResponse } from "next/server";
import CustomerOrder from "../../../models/customerOrder";
import { dbConnect } from "../dbConnect";
import dayjs from "dayjs";

export async function GET(request) {
    await dbConnect();

    const url = new URL(request.url);
    const today = url.searchParams.get("today");
    const lastWeek = url.searchParams.get("lastWeek");
    const lastMonth = url.searchParams.get("lastMonth");

    const matchStage = {
        $or: [
            { order_title: { $in: ["Tuborg Gold", "Gorkha Strong", "Barahsinghe", "Tuborg Strong"] } },
            { order_title: { $regex: /8848/i } },
            { order_title: { $regex: /Nude/i } },
        ]
    };

    // Date range filtering
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
            { $sort: { total_quantity: -1 } }
        ]);

        // Process the results
        const result = {
            "Tuborg Gold": 0,
            "Gorkha Strong": 0,
            "Barahsinghe": 0,
            "Tuborg Strong": 0
        };

        let total8848Ml = 0;
        let totalNudeMl = 0;

        ordersWithTables.forEach(order => {
            const title = order._id;
            const quantity = order.total_quantity;
            
            if (title.includes("8848")) {
                // Extract ml value from title (e.g., "8848 - 750ml Bottle" → 750)
                const mlMatch = title.match(/(\d+)ml/i);
                const mlValue = mlMatch ? parseInt(mlMatch[1]) : 750; // Default to 750ml if not specified
                total8848Ml += quantity * mlValue;
            }
            if (title.includes("Nude")) {
                // Extract ml value from title (e.g., "8848 - 750ml Bottle" → 750)
                const mlMatch = title.match(/(\d+)ml/i);
                const mlValue = mlMatch ? parseInt(mlMatch[1]) : 750; // Default to 750ml if not specified
                totalNudeMl += quantity * mlValue;
            }

            result[title] = quantity;
        });

        // Add the total 8848 ml field to the response
        const response = {
            ...result,
            total_8848_ml: total8848Ml,
            total_Nude_ml: totalNudeMl,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}