"use client";

import { Button } from "@/components/ui/button";
import { logout } from "./action";
import LogoutIcon from "@mui/icons-material/Logout";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => logout()}
      style={{ background: "none", boxShadow: "none" }}
    >
      <LogoutIcon />
    </Button>
  );
}
