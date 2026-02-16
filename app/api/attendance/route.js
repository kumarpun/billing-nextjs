import { NextResponse } from "next/server";
import Attendance from "../../../models/attendance";
import { dbConnect } from "../dbConnect";
import { toNepalTime } from "../../utils/nepalTime";

export async function GET() {
    await dbConnect();
    try {
        const attendancelist = await Attendance.find().lean();
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
        // const checkInDate = new Date(checkInTime);
        // const shiftDate = new Date(date);
        const checkInDate = toNepalTime(checkInTime);
        const shiftDate = toNepalTime(date);

  
        let expectedCheckInTime;
        let shiftDurationMinutes = 0;
  
        if (shiftTime === "Morning") {
          expectedCheckInTime = new Date(shiftDate);
          const [hours, minutes] = standardShiftMorning.split(':');
          expectedCheckInTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
          // Grace period until 10:15 AM
          const graceEnd = new Date(expectedCheckInTime);
          graceEnd.setMinutes(graceEnd.getMinutes() + 15);
  
          // Morning shift duration: 10 AM - 8 PM (10 hours = 600 minutes)
          shiftDurationMinutes = 10 * 60;
  
          if (checkInDate > graceEnd) {
            const lateMs = checkInDate - graceEnd;
            timeLostMinutes = Math.floor(lateMs / (1000 * 60));
            
            // Only calculate deduction if late beyond grace period
            if (timeLostMinutes > 0) {
              deductionPercentage = (timeLostMinutes / shiftDurationMinutes) * 100;
              salaryDeduction = (salary * deductionPercentage) / 100;
            }
          }
  
        } else if (shiftTime === "Afternoon") {
          expectedCheckInTime = new Date(shiftDate);
          const [hours, minutes] = standardShiftAfternoon.split(':');
          expectedCheckInTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
          // Grace period until 12:15 PM
          const graceEnd = new Date(expectedCheckInTime);
          graceEnd.setMinutes(graceEnd.getMinutes() + 15);
  
          // Afternoon shift duration: 12 PM - 11 PM (11 hours = 660 minutes)
          shiftDurationMinutes = 11 * 60;
  
          if (checkInDate > graceEnd) {
            const lateMs = checkInDate - graceEnd;
            timeLostMinutes = Math.floor(lateMs / (1000 * 60));
            
            // Only calculate deduction if late beyond grace period
            if (timeLostMinutes > 0) {
              deductionPercentage = (timeLostMinutes / shiftDurationMinutes) * 100;
              salaryDeduction = (salary * deductionPercentage) / 100;
            }
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

      // Update directly - findByIdAndUpdate returns null if not found
      const updatedAttendance = await Attendance.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

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

//   export async function PUT(request) {
//     try {
//       const { id, ...updateData } = await request.json();
      
//       if (!id) {
//         return NextResponse.json({ error: "ID is required" }, { status: 400 });
//       }
  
//       await dbConnect();
      
//       const existingAttendance = await Attendance.findById(id);
//       if (!existingAttendance) {
//         return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
//       }
  
//       const updatedData = { ...existingAttendance.toObject(), ...updateData };
      
//       let timeLostMinutes = 0;
//       let salaryDeduction = 0;
//       let deductionPercentage = 0;
  
//       // Determine shift automatically based on checkInTime if status is present
//       if ((updateData.checkInTime || updateData.status) && updatedData.status === "present") {
//         const checkInDate = new Date(updatedData.checkInTime);
//         const shiftDate = new Date(updatedData.date);
  
//         let expectedCheckInTime;
//         let shiftDurationMinutes = 0;
  
//         // Auto determine shift based on checkInTime
//         const morningStart = new Date(shiftDate);
//         morningStart.setHours(10, 0, 0, 0); // Morning shift starts 10:00 AM
  
//         const afternoonStart = new Date(shiftDate);
//         afternoonStart.setHours(12, 0, 0, 0); // Afternoon shift starts 12:00 PM
  
//         if (checkInDate < afternoonStart) {
//           // Morning shift
//           updatedData.shiftTime = "Morning";
          
//           // Parse the standard shift time (handle both "10:40" and "10L40" formats)
//           let standardTime = updatedData.standardShiftMorning;
//           if (standardTime.includes('L')) {
//             standardTime = standardTime.replace('L', ':');
//           }
          
//           const [hours, minutes] = standardTime.split(':').map(Number);
//           expectedCheckInTime = new Date(shiftDate);
//           expectedCheckInTime.setHours(hours, minutes, 0, 0);
  
//           // Grace period until 10:15 AM (or 15 minutes after standard time)
//           const graceEnd = new Date(expectedCheckInTime);
//           graceEnd.setMinutes(graceEnd.getMinutes() + 15);
  
//           shiftDurationMinutes = 10 * 60; // 10 AM - 8 PM (10 hours)
  
//           if (checkInDate > graceEnd) {
//             const lateMs = checkInDate - graceEnd;
//             timeLostMinutes = Math.floor(lateMs / (1000 * 60));
//             if (timeLostMinutes > 0) {
//               deductionPercentage = (timeLostMinutes / shiftDurationMinutes) * 100;
//               salaryDeduction = (updatedData.salary * deductionPercentage) / 100;
//             }
//           }
//         } else {
//           // Afternoon shift
//           updatedData.shiftTime = "Afternoon";
          
//           // Parse the standard shift time (handle both "12:00" and "12L00" formats)
//           let standardTime = updatedData.standardShiftAfternoon;
//           if (standardTime.includes('L')) {
//             standardTime = standardTime.replace('L', ':');
//           }
          
//           const [hours, minutes] = standardTime.split(':').map(Number);
//           expectedCheckInTime = new Date(shiftDate);
//           expectedCheckInTime.setHours(hours, minutes, 0, 0);
  
//           const graceEnd = new Date(expectedCheckInTime);
//           graceEnd.setMinutes(graceEnd.getMinutes() + 15);
  
//           shiftDurationMinutes = 11 * 60; // 12 PM - 11 PM (11 hours)
  
//           if (checkInDate > graceEnd) {
//             const lateMs = checkInDate - graceEnd;
//             timeLostMinutes = Math.floor(lateMs / (1000 * 60));
//             if (timeLostMinutes > 0) {
//               deductionPercentage = (timeLostMinutes / shiftDurationMinutes) * 100;
//               salaryDeduction = (updatedData.salary * deductionPercentage) / 100;
//             }
//           }
//         }
//       }
  
//       updatedData.timeLost = timeLostMinutes;
//       updatedData.salaryDeduction = salaryDeduction;
//       updatedData.deductionPercentage = deductionPercentage;
  
//       const updatedAttendance = await Attendance.findByIdAndUpdate(
//         id,
//         updatedData,
//         { new: true, runValidators: true }
//       );
  
//       return NextResponse.json({ 
//         message: "Attendance updated successfully.", 
//         attendance: updatedAttendance 
//       }, { status: 200 });
  
//     } catch (error) {
//       console.error("Error updating attendance:", error);
//       return NextResponse.json({ 
//         error: "Error updating attendance", 
//         details: error.message 
//       }, { status: 500 });
//     }
//   }