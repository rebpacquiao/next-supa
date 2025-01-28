import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import React from "react";
import AppBarMenu from "./appBarMenu";

export default async function Dashboard() {
  return (
    <>
      <div className="flex h-screen bg-gray-200">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppBarMenu />
          <DashboardContent />
        </div>
      </div>
    </>
  );
}
