import { NextResponse } from "next/server";
import Credit from "../../../../models/credit";
import { dbConnect } from "../../dbConnect";

export async function PUT(request, { params }) {
    const { id } = params;
    
    try {
        const { creditlist } = await request.json();
        await dbConnect();

        const updatedCredits = [];
        
        for (const creditItem of creditlist) {
            const { _id, paid, remarks, ...otherFields } = creditItem;

            const updateData = {
                ...otherFields,   // ✅ includes name, date, amount, etc.
                paid,
                remarks,
                ...(paid && { paidDate: new Date() }),
                updatedAt: new Date()
            };

            const updatedCredit = await Credit.findOneAndUpdate(
                { _id: _id },
                updateData,
                { new: true, runValidators: true }
            );
            
            if (updatedCredit) {
                updatedCredits.push(updatedCredit);
            }
        }

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
