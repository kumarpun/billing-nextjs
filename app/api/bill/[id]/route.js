import { NextResponse } from "next/server";
import Bill from "../../../../models/bill";
import CustomerOrder from "../../../../models/customerOrder";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { dbConnect } from "../../dbConnect";

export async function GET(request, { params }) {
    const { id } = params;

    // Extract and verify the token
    try {
        const authToken = request.cookies.get("authToken")?.value;

        try {
            jwt.verify(authToken, process.env.NEXTAUTH_SECRET);
        } catch (error) {
            return NextResponse.json({ error: 'Error verifying token' }, { status: 500 });
        }

        await dbConnect();

        const billById = await Bill.find({
            tablebill_id: id,
            billStatus: { $in: ["pending", "paid"] }
        }).lean();

        if (!billById || billById.length === 0) {
            return NextResponse.json({
                billById: [],
                totalFinalbill: 0,
                billFinalStatus: "Bill not generated yet"
            }, { status: 200 });
        }

        // const totalFinalbill = billById.reduce((acc, bill) => acc + bill.finalPrice, 0);
        const totalFinalbill = billById[0].finalPrice;
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
        const authToken = request.cookies.get("authToken")?.value;

        try {
            jwt.verify(authToken, process.env.NEXTAUTH_SECRET);
        } catch (error) {
            return NextResponse.json({ error: 'Error verifying token' }, { status: 500 });
        }

        const { billStatus, finalPrice, billPaymentMode, qrAmount, cashAmount, remarks } = await request.json();
        
        await dbConnect();

        // Update all matching bills (pending or paid) so bills can be re-updated after payment
        await Bill.updateMany(
            { tablebill_id: id, billStatus: { $in: ["pending", "paid"] } },
            { $set: { billStatus, finalPrice, billPaymentMode, qrAmount, cashAmount, remarks } }
        );

        // When bill is paid, update customer_status to "Bill paid" on related orders
        if (billStatus === "paid") {
            await CustomerOrder.updateMany(
                { table_id: id, customer_status: { $in: ["Customer accepted", "Bill paid"] } },
                { $set: { customer_status: "Bill paid" } }
            );
        }

        const updatedBills = await Bill.find({ tablebill_id: id, billStatus: { $in: ["pending", "paid"] } }).lean();

        return NextResponse.json(updatedBills, { status: 200 });
    } catch (error) {
        console.error('Error updating bills:', error);
        return NextResponse.json({ error: 'Error updating bills' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;

    // Extract and verify the token
    try {
        const authToken = request.cookies.get("authToken")?.value;

        if (!authToken) {
            return NextResponse.json({ error: 'No authentication token provided' }, { status: 401 });
        }

        try {
            jwt.verify(authToken, process.env.NEXTAUTH_SECRET);
        } catch (error) {
            return NextResponse.json({ error: 'Error verifying token' }, { status: 403 });
        }

        await dbConnect(); // Reused MongoDB connection

        // Delete the bill using _id
        const result = await Bill.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Bill not found or already deleted' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Bill deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting bill:', error);
        return NextResponse.json({ error: 'Error deleting bill' }, { status: 500 });
    }
}

