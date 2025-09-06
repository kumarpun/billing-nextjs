import { NextResponse } from "next/server";
import Attendance from "../../../models/attendance";
import { dbConnect } from "../dbConnect";

export async function GET() {
    await dbConnect();
    try {
        const attendancelist = await Attendance.find();
        return NextResponse.json({ attendancelist });
    } catch (error) {
        console.error("Error fetching attendancelist:", error);
        return NextResponse.json({ error: "Error fetching attendancelist" }, { status: 500 });
    }
}

export async function POST(request) {
  try {
    const { 
      name, 
      shiftTime, 
      standardShiftMorning, 
      standardShiftAfternoon, 
      checkInTime, 
      checkOutTime, 
      remarks, 
      salary, 
      status, 
      date 
    } = await request.json();

    await dbConnect();

    let timeLostMinutes = 0;
    let salaryDeduction = 0;
    let deductionPercentage = 0;

    if (checkInTime && status === "present") {
      const checkInDate = new Date(checkInTime);
      const shiftDate = new Date(date);

      let expectedCheckInTime;
      let shiftDurationMinutes = 0;

      if (shiftTime === "Morning") {
        expectedCheckInTime = new Date(shiftDate);
        const [hours, minutes] = standardShiftMorning.split(':');
        expectedCheckInTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Grace till 10:15
        const graceEnd = new Date(expectedCheckInTime);
        graceEnd.setMinutes(graceEnd.getMinutes() + 15);

        shiftDurationMinutes = 10 * 60; // 10 AM - 8 PM = 600 minutes

        if (checkInDate > graceEnd) {
          const lateMs = checkInDate - graceEnd;
          timeLostMinutes = Math.floor(lateMs / (1000 * 60));

          deductionPercentage = (timeLostMinutes / shiftDurationMinutes) * 100;
          salaryDeduction = (salary * deductionPercentage) / 100;
        }

      } else if (shiftTime === "Afternoon") {
        expectedCheckInTime = new Date(shiftDate);
        const [hours, minutes] = standardShiftAfternoon.split(':');
        expectedCheckInTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Grace till 12:15
        const graceEnd = new Date(expectedCheckInTime);
        graceEnd.setMinutes(graceEnd.getMinutes() + 15);

        shiftDurationMinutes = 11 * 60; // 12 PM - 11 PM = 660 minutes

        if (checkInDate > graceEnd) {
          const lateMs = checkInDate - graceEnd;
          timeLostMinutes = Math.floor(lateMs / (1000 * 60));

          deductionPercentage = (timeLostMinutes / shiftDurationMinutes) * 100;
          salaryDeduction = (salary * deductionPercentage) / 100;
        }
      }
    }

    // Create attendance record
    await Attendance.create({
      name,
      shiftTime,
      standardShiftMorning,
      standardShiftAfternoon,
      checkInTime,
      checkOutTime,
      remarks,
      timeLost: timeLostMinutes,      // minutes late
      salary,
      salaryDeduction,
      deductionPercentage,            // % late
      status,
      date
    });

    return NextResponse.json(
      {
        message: "Attendance saved successfully.",
        salaryDeduction,
        deductionPercentage,
        timeLostMinutes
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to save Attendance.", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
    try {
      const { id, ...updateData } = await request.json();
      
      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }
  
      await dbConnect();
      
      const updatedAttendance = await Attendance.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );
      
      if (!updatedAttendance) {
        return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
      }
      
      return NextResponse.json({ 
        message: "Attendance updated successfully.", 
        attendance: updatedAttendance 
      }, { status: 200 });
      
    } catch (error) {
      console.error("Error updating attendance:", error);
      return NextResponse.json({ 
        error: "Error updating attendance", 
        details: error.message 
      }, { status: 500 });
    }
  }