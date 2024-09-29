import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import Bill from "../../../models/bill";
import dayjs from "dayjs";

export async function POST(request) {
    const { originalPrice, finalPrice, discountPercent, remarks, tablebill_id, billStatus } = await request.json();
    await connectMongoDB();
    await Bill.create({ originalPrice, discountPercent, remarks, finalPrice, tablebill_id, billStatus});
    return NextResponse.json({ message: "Bill created successfully." }, { status: 201 });
}

// export async function GET() {
//     await connectMongoDB();
//     const bill = await Bill.find();
//     const totalFinalPrice = bill.reduce((sum, sale) => {
//         return sum + (sale.finalPrice || 0);
//     }, 0);
//     return NextResponse.json({bill, totalFinalPrice});
// }

// export async function GET() {
//     await connectMongoDB();
//     const oneWeekAgo = dayjs().subtract(7, 'day').toDate();    
//     const bills = await Bill.find({
//         createdAt: { $gte: oneWeekAgo } // Query to fetch bills created after the calculated date
//     });
//     const totalFinalPrice = bills.reduce((sum, bill) => {
//         return sum + (bill.finalPrice || 0);
//     }, 0);
//     return NextResponse.json({ bills, totalFinalPrice }, { status: 200 });
// }

export async function GET(request) {
    await connectMongoDB();
    
    const url = new URL(request.url);
    const lastWeek = url.searchParams.get("lastWeek");
    const lastMonth = url.searchParams.get("lastMonth");

    let bills;
    let totalFinalPrice;

    if (lastWeek === "true") {
        // Fetch bills created in the last 7 days
        const oneWeekAgo = dayjs().subtract(7, 'day').toDate();    
        bills = await Bill.find({
            createdAt: { $gte: oneWeekAgo }
        });
    } else if (lastMonth === "true") {
        // Fetch bills created in the last month
        const oneMonthAgo = dayjs().subtract(1, 'month').toDate();
        bills = await Bill.find({
            createdAt: { $gte: oneMonthAgo }
        });
    } else {
        bills = await Bill.find();
    }

    totalFinalPrice = bills.reduce((sum, bill) => {
        return sum + (bill.finalPrice || 0);
    }, 0);
    
    return NextResponse.json({ bills, totalFinalPrice }, { status: 200 });
}