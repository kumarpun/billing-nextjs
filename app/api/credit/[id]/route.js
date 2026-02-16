import { NextResponse } from "next/server";
import Credit from "../../../../models/credit";
import { dbConnect } from "../../dbConnect";

export async function PUT(request, { params }) {
    const { id } = params;
    
    try {
        const { creditlist } = await request.json();
        await dbConnect();

        // Bulk update all credits in a single DB operation instead of looping
        const bulkOps = creditlist.map(creditItem => {
            const { _id, paid, remarks, ...otherFields } = creditItem;
            return {
                updateOne: {
                    filter: { _id },
                    update: {
                        $set: {
                            ...otherFields,
                            paid,
                            remarks,
                            ...(paid && { paidDate: new Date() }),
                            updatedAt: new Date()
                        }
                    }
                }
            };
        });

        await Credit.bulkWrite(bulkOps);

        // Fetch updated documents
        const updatedIds = creditlist.map(c => c._id);
        const updatedCredits = await Credit.find({ _id: { $in: updatedIds } }).lean();

        return NextResponse.json({
            message: "Credits updated successfully",
            updatedCredits
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error updating credits:", error);
        return NextResponse.json({ 
            error: "Error updating credits",
            details: error.message 
        }, { status: 500 });
    }
}
