import { NextResponse } from "next/server";
import Checklist from "../../../../models/checklist";
import { dbConnect } from "../../dbConnect";

export async function PATCH(request, { params }) {
    const { id } = params;
    const { isChecked } = await request.json();
    
    try {
      await dbConnect();
      const updatedItem = await Checklist.findByIdAndUpdate(
        id,
        { isChecked },
        { new: true }
      );
      
      if (!updatedItem) {
        return NextResponse.json(
          { message: "Checklist item not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(updatedItem);
    } catch (error) {
      return NextResponse.json(
        { message: "Error updating checklist", error: error.message },
        { status: 500 }
      );
    }
  }