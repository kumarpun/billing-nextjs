import { NextResponse } from "next/server";
import Bill from "../../../models/bill";
import { connectMongoDB } from "../../../lib/mongodb";
import dayjs from "dayjs";

export async function GET(request) {
    await connectMongoDB();

    // Get data for the last 5 days (including today)
    const dailyTotals = [];
    
    for (let i = 0; i < 7; i++) {
        const date = dayjs().subtract(i, 'day');
        const startOfDay = date.startOf('day').toDate();
        const endOfDay = date.endOf('day').toDate();
        
        const bills = await Bill.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });
        
        const totalFinalPrice = bills.reduce((sum, bill) => sum + (bill.finalPrice || 0), 0);
        
        dailyTotals.push({
            date: date.format('YYYY-MM-DD'), // Format date as string
            dayName: date.format('dddd'),    // Day name (e.g., "Monday")
            totalFinalPrice,
        });
    }

    return NextResponse.json({ dailyTotals }, { status: 200 });
}