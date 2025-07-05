"use client";
import DashboardLayout from "../components/dashboardLayout";
import EmployeeBirthday from "../empbirthday/page";

export default function Dashboard() {
  // ... dashboard specific logic
  
  return (
    <DashboardLayout activeTab="dashboard">
      {/* Dashboard specific content */}
      <EmployeeBirthday />
    </DashboardLayout>
  );
}