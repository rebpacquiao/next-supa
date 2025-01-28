import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./LogoutButton";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";

export default async function Dashboard() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex h-screen bg-gray-200">
        <div className="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <DashboardContent />
        </div>
      </div>
    </>
  );
}
