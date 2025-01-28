import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./LogoutButton";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
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
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <MenuIcon />
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" component="p" sx={{ mr: 2 }}>
                  Hello {data.user.email}
                </Typography>
                <LogoutButton />
              </Box>
            </Toolbar>
          </AppBar>
          <DashboardContent />
        </div>
      </div>
    </>
  );
}
