import { NextResponse } from "next/server";
import CustomerOrder from "../../../models/customerOrder";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect();
    try {
        // Single aggregation query to count tables with active orders
        const result = await CustomerOrder.aggregate([
            {
                $match: {
                    customer_status: { $in: ["Customer accepted", "Bill paid"] }
                }
            },
            {
                $group: {
                    _id: "$table_id"
                }
            },
            {
                $count: "runningTablesCount"
            }
        ]);

        const runningTablesCount = result.length > 0 ? result[0].runningTablesCount : 0;

        return NextResponse.json({ runningTablesCount }, { status: 200 });
    } catch (error) {
        console.error("Error fetching running tables count:", error);
        return NextResponse.json({ error: "Error fetching running tables count" }, { status: 500 });
    }
}
