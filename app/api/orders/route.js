import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import CustomerOrder from "../../../models/customerOrder";
import Table from "../../../models/table";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
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

// export async function GET(request, response) {
//     try {
//         // const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
//         // if (!token) {
//         //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//         // }
//         await connectMongoDB();

//         // Perform aggregation or $lookup operation to join CustomerOrder with Table
//         const ordersWithTables = await CustomerOrder.aggregate([
//             {
//                 $lookup: {
//                     from: "tables", // Collection name of the Table model
//                     localField: "table_id",
//                     foreignField: "_id",
//                     as: "table"
//                 }
//             },
//             {
//                 $addFields: {
//                     total_price: { $multiply: ["$order_price", "$order_quantity"] }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     total_bill: { $sum: "$total_price" },
//                     orders: { $push: "$$ROOT" }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     total_bill: 1,
//                     orders: 1
//                 }
//             }
//         ]);

//         // Return the results in the response
//         return NextResponse.json({ ordersWithTables }, { status: 200 });
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }

// export async function GET(request) {
//     await dbConnect(); // Reused MongoDB connection
    
//     const url = new URL(request.url);
//     const today = url.searchParams.get("today");
//     const lastWeek = url.searchParams.get("lastWeek");
//     const lastMonth = url.searchParams.get("lastMonth");

//     const matchStage = {};

//     // Determine the date range based on the filter
//     if (today === "true") {
//         const startOfToday = dayjs().startOf('day').toDate();
//         const endOfToday = dayjs().endOf('day').toDate();
//         matchStage.createdAt = { $gte: startOfToday, $lte: endOfToday };
//     } else if (lastWeek === "true") {
//         const oneWeekAgo = dayjs().subtract(7, 'day').startOf('day').toDate();
//         const todayEnd = dayjs().endOf('day').toDate();
//         matchStage.createdAt = { $gte: oneWeekAgo, $lte: todayEnd };
//     } else if (lastMonth === "true") {
//         const oneMonthAgo = dayjs().subtract(1, 'month').startOf('day').toDate();
//         const todayEnd = dayjs().endOf('day').toDate();
//         matchStage.createdAt = { $gte: oneMonthAgo, $lte: todayEnd };
//     }

//     try {
//         const ordersWithTables = await CustomerOrder.aggregate([
//             { $match: matchStage },
//             {
//                 $lookup: {
//                     from: "tables",
//                     localField: "table_id",
//                     foreignField: "_id",
//                     as: "table"
//                 }
//             },
//             {
//                 $addFields: {
//                     total_price: { $multiply: ["$order_price", "$order_quantity"] }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     total_bill: { $sum: "$total_price" },
//                     orders: { $push: "$$ROOT" }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     total_bill: 1,
//                     orders: 1
//                 }
//             }
//         ]);

//         return NextResponse.json({ ordersWithTables }, { status: 200 });
//     } catch (error) {
//         console.error("Error:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }

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

        return NextResponse.json({ ordersWithTables }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect(); // Reused MongoDB connection
    await CustomerOrder.findByIdAndDelete(id);
    return NextResponse.json({ message: "Order deleted." });
}


