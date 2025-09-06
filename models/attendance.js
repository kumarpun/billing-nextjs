import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    name: String,
    shiftTime: String,
    standardShiftMorning: String,
    standardShiftAfternoon: String,
    checkInTime: Date,
    checkOutTime: Date,
    remarks: String,
    timeLost: Number,              // <-- store minutes instead of Date
    salary: Number,
    salaryDeduction: Number,
    deductionPercentage: Number,   // <-- new field for clarity
    status: String,
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

export default Attendance;
