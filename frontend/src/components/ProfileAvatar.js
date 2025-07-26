// components/ProfileAvatar.js
import { useState } from "react";
import { Avatar, Menu } from "@mui/material";
import ProfileDropdown from "./ProfileDropdown";

export default function ProfileAvatar({ name = "U" }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Avatar
        onClick={handleOpen}
        sx={{
          bgcolor: "#1e88e5",
          width: 32,
          height: 32,
          fontSize: 14,
          marginLeft: "18px",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {name?.[0]?.toUpperCase() || "U"}
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        PaperProps={{
          elevation: 4,
          sx: {
            bgcolor: "#121212",
            color: "#fff",
            borderRadius: 2,
            mt: 1.5,
            minWidth: 200,
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
            "& .MuiMenuItem-root:hover": { backgroundColor: "#1e1e1e" },
          },
        }}
      >
        <ProfileDropdown closeDropdown={handleClose} />
      </Menu>
    </>
  );
}
