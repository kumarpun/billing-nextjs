import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Bill from "../../../../models/bill";

export async function GET(request, { params }) {
    const { id } = params;
    await connectMongoDB();

    try {
        // Fetch the bill using tablebill_id
        const billById = await Bill.find({ 
            tablebill_id: id,
            billStatus: ["pending"]
         });

         if (!billById || billById.length === 0) {
            return NextResponse.json({
                billById: [],
                totalFinalbill: 0,
                billFinalStatus: "Bill not generated yet"
            }, { status: 200 });
        }

        const totalFinalbill = billById.reduce((acc, bill) => acc + bill.finalPrice, 0);
        const billFinalStatus = billById[0].billStatus;

        const response = {
            billById,
            totalFinalbill,
            billFinalStatus
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error fetching bill:', error);
        return NextResponse.json({ error: 'Error fetching bill' }, { status: 500 });
    }
}


export async function PUT(request, { params }) {
    const { id } = params;
    
    try {
        const { billStatus, finalPrice } = await request.json();
        
        await connectMongoDB();
        
        // Find all bills with the specified tablebill_id
        const bills = await Bill.find({ 
            tablebill_id: id,
            billStatus: ["pending"]
         });

         const updatedBills = [];    
        // Update the billStatus for each bill
        for (const bill of bills) {
            const updatedBill = await Bill.findOneAndUpdate(
                { _id: bill._id }, // Use _id to uniquely identify each bill
                { billStatus, finalPrice },
                { new: true }
            );
            updatedBills.push(updatedBill);
        }

        // Fetch updated bills
        // const updatedBills = await Bill.find({ tablebill_id: id });

        return NextResponse.json(updatedBills, { status: 200 });
    } catch (error) {
        console.error('Error updating bills:', error);
        return NextResponse.json({ error: 'Error updating bills' }, { status: 500 });
    }
}