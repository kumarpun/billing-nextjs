import { NextResponse } from "next/server";
import Bill from "../../../models/bill";
import { dbConnect } from "../dbConnect";
import dayjs from "dayjs";

export async function GET(request) {
    await dbConnect();

    const sevenDaysAgo = dayjs().subtract(6, 'day').startOf('day').toDate();
    const endOfToday = dayjs().endOf('day').toDate();

    // Single aggregation query instead of 7 separate queries
    const results = await Bill.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo, $lte: endOfToday }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                totalFinalPrice: { $sum: { $ifNull: ["$finalPrice", 0] } }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Build a map from aggregation results
    const resultsMap = {};
    results.forEach(r => { resultsMap[r._id] = r.totalFinalPrice; });

    // Fill in all 7 days (including days with no sales)
    const dailyTotals = [];
    for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day');
        const dateStr = date.format('YYYY-MM-DD');
        dailyTotals.push({
            date: dateStr,
            dayName: date.format('dddd'),
            totalFinalPrice: resultsMap[dateStr] || 0,
        });
    }

    return NextResponse.json({ dailyTotals }, { status: 200 });
}