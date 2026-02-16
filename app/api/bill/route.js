import { NextResponse } from "next/server";
import Bill from "../../../models/bill";
import { dbConnect } from "../dbConnect";
import dayjs from "dayjs";

export async function POST(request) {
    const { originalPrice, finalPrice, discountPercent, remarks, tablebill_id, billStatus, kitchenPrice, barPrice } = await request.json();
    await dbConnect();
    await Bill.create({ originalPrice, discountPercent, remarks, finalPrice, tablebill_id, billStatus, kitchenPrice, barPrice });
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

// export async function GET(request) {
//     await connectMongoDB();
    
//     const url = new URL(request.url);
//     const lastWeek = url.searchParams.get("lastWeek");
//     const lastMonth = url.searchParams.get("lastMonth");

//     let bills;
//     let totalFinalPrice;

//     if (lastWeek === "true") {
//         // Fetch bills created in the last 7 days
//         const oneWeekAgo = dayjs().subtract(7, 'day').toDate();    
//         bills = await Bill.find({
//             createdAt: { $gte: oneWeekAgo }
//         });
//     } else if (lastMonth === "true") {
//         // Fetch bills created in the last month
//         const oneMonthAgo = dayjs().subtract(1, 'month').toDate();
//         bills = await Bill.find({
//             createdAt: { $gte: oneMonthAgo }
//         });
//     } else {
//         bills = await Bill.find();
//     }

//     totalFinalPrice = bills.reduce((sum, bill) => {
//         return sum + (bill.finalPrice || 0);
//     }, 0);
    
//     return NextResponse.json({ bills, totalFinalPrice }, { status: 200 });
// }

// export async function GET(request) {
//     await connectMongoDB();
    
//     const url = new URL(request.url);
//     const today = url.searchParams.get("today"); // Check for 'today' parameter
//     const lastWeek = url.searchParams.get("lastWeek");
//     const lastMonth = url.searchParams.get("lastMonth");

//     let bills;
//     let totalFinalPrice;

//     if (today === "true") {
//         // Fetch bills created today only
//         const startOfToday = dayjs().startOf('day').toDate(); // Start of today (00:00:00)
//         const endOfToday = dayjs().endOf('day').toDate();     // End of today (23:59:59)

//         bills = await Bill.find({
//             createdAt: { $gte: startOfToday, $lte: endOfToday } // Fetch records only for today
//         });
//     } else if (lastWeek === "true") {
//         // Fetch bills created in the last 7 days
//         const oneWeekAgo = dayjs().subtract(7, 'day').startOf('day').toDate();
//         const todayEnd = dayjs().endOf('day').toDate();

//         bills = await Bill.find({
//             createdAt: { $gte: oneWeekAgo, $lte: todayEnd }
//         });
//     } else if (lastMonth === "true") {
//         // Fetch bills created in the last month
//         const oneMonthAgo = dayjs().subtract(1, 'month').startOf('day').toDate();
//         const todayEnd = dayjs().endOf('day').toDate();

//         bills = await Bill.find({
//             createdAt: { $gte: oneMonthAgo, $lte: todayEnd }
//         });
//     } else {
//         // Fetch all bills if no specific filter is applied
//         bills = await Bill.find();
//     }

//     totalFinalPrice = bills.reduce((sum, bill) => {
//         return sum + (bill.finalPrice || 0);
//     }, 0);
    
//     return NextResponse.json({ bills, totalFinalPrice }, { status: 200 });
// }


// export async function GET(request) {
//     await connectMongoDB();
    
//     const url = new URL(request.url);
//     const today = url.searchParams.get("today");
//     const lastWeek = url.searchParams.get("lastWeek");
//     const lastMonth = url.searchParams.get("lastMonth");

//     let bills;
//     let totalFinalPrice = 0;
//     let totalKitchenPrice = 0;
//     let totalBarPrice = 0;

//     if (today === "true") {
//         const startOfToday = dayjs().startOf('day').toDate();
//         const endOfToday = dayjs().endOf('day').toDate();

//         bills = await Bill.find({
//             createdAt: { $gte: startOfToday, $lte: endOfToday }
//         });
//     } else if (lastWeek === "true") {
//         const oneWeekAgo = dayjs().subtract(7, 'day').startOf('day').toDate();
//         const todayEnd = dayjs().endOf('day').toDate();

//         bills = await Bill.find({
//             createdAt: { $gte: oneWeekAgo, $lte: todayEnd }
//         });
//     } else if (lastMonth === "true") {
//         const oneMonthAgo = dayjs().subtract(1, 'month').startOf('day').toDate();
//         const todayEnd = dayjs().endOf('day').toDate();

//         bills = await Bill.find({
//             createdAt: { $gte: oneMonthAgo, $lte: todayEnd }
//         });
//     } else {
//         bills = await Bill.find();
//     }

//     // Calculate total prices
//     bills.forEach(bill => {
//         totalFinalPrice += bill.finalPrice || 0;
//         totalKitchenPrice += bill.kitchenPrice || 0;
//         totalBarPrice += bill.barPrice || 0;
//     });
    
//     return NextResponse.json({ bills, totalFinalPrice, totalKitchenPrice, totalBarPrice }, { status: 200 });
// }

export async function GET(request) {
    await dbConnect();
    const url = new URL(request.url);
    const today = url.searchParams.get("today");
    const lastWeek = url.searchParams.get("lastWeek");
    const lastMonth = url.searchParams.get("lastMonth");
    const custom = url.searchParams.get("custom");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const totalsOnly = url.searchParams.get("totalsOnly");

    const matchStage = {};

    if (today === "true") {
        matchStage.createdAt = { $gte: dayjs().startOf("day").toDate(), $lte: dayjs().endOf("day").toDate() };
    } else if (lastWeek === "true") {
        matchStage.createdAt = { $gte: dayjs().subtract(7, "day").startOf("day").toDate(), $lte: dayjs().endOf("day").toDate() };
    } else if (lastMonth === "true") {
        matchStage.createdAt = { $gte: dayjs().subtract(1, "month").startOf("day").toDate(), $lte: dayjs().endOf("day").toDate() };
    } else if (custom === "true" && startDate && endDate) {
        matchStage.createdAt = { $gte: dayjs(startDate).startOf("day").toDate(), $lte: dayjs(endDate).endOf("day").toDate() };
    }

    // For dashboard: just compute totals in DB, skip fetching individual bills
    if (totalsOnly === "true") {
        const [totals] = await Bill.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalFinalPrice: { $sum: { $ifNull: ["$finalPrice", 0] } },
                    totalKitchenPrice: { $sum: { $ifNull: ["$kitchenPrice", 0] } },
                    totalBarPrice: { $sum: { $ifNull: ["$barPrice", 0] } },
                }
            }
        ]);

        return NextResponse.json({
            totalFinalPrice: totals?.totalFinalPrice || 0,
            totalKitchenPrice: totals?.totalKitchenPrice || 0,
            totalBarPrice: totals?.totalBarPrice || 0,
        }, { status: 200 });
    }

    // For report pages: fetch bills with lean() for faster serialization
    const bills = await Bill.find(matchStage).lean();

    let totalFinalPrice = 0;
    let totalKitchenPrice = 0;
    let totalBarPrice = 0;

    bills.forEach((bill) => {
        totalFinalPrice += bill.finalPrice || 0;
        totalKitchenPrice += bill.kitchenPrice || 0;
        totalBarPrice += bill.barPrice || 0;
    });

    return NextResponse.json({ bills, totalFinalPrice, totalKitchenPrice, totalBarPrice }, { status: 200 });
}