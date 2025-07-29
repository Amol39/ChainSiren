import {
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Typography
} from "@mui/material";
import {
  Person,
  Settings,
  Logout,
  ListAlt,
  NotificationsActive,
  CreditCard
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import { toast } from "react-toastify";

export default function ProfileDropdown({ anchorEl, onClose }) {
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { logout } = useLogin();

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    logout(); // call context logout
    onClose();
    toast.success("Logged out successfully");
    navigate("/");

    // Optional: force UI reload if some components don't react to context
    setTimeout(() => {
      window.location.reload();
    }, 500); // short delay ensures toast is visible before reload
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 4,
        sx: {
          bgcolor: "#121212",
          color: "#fff",
          borderRadius: 2,
          mt: 1.5,
          minWidth: 200,
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          "& .MuiMenuItem-root": {
            "&:hover": { backgroundColor: "#1e1e1e" }
          }
        }
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={() => handleNavigate("/profile")}>
        <ListItemIcon><Person sx={{ color: "#fff" }} /></ListItemIcon>
        <Typography variant="body2">My Profile</Typography>
      </MenuItem>

      <MenuItem onClick={() => handleNavigate("/alerts")}>
        <ListItemIcon><ListAlt sx={{ color: "#fff" }} /></ListItemIcon>
        <Typography variant="body2">My Alerts</Typography>
      </MenuItem>

      <MenuItem onClick={() => handleNavigate("/notification-preferences")}>
        <ListItemIcon><NotificationsActive sx={{ color: "#fff" }} /></ListItemIcon>
        <Typography variant="body2">Notification Preferences</Typography>
      </MenuItem>

      <MenuItem onClick={() => handleNavigate("/subscriptions")}>
        <ListItemIcon><CreditCard sx={{ color: "#fff" }} /></ListItemIcon>
        <Typography variant="body2">Subscriptions</Typography>
      </MenuItem>

      <Divider sx={{ bgcolor: "#333" }} />

      <MenuItem onClick={() => handleNavigate("/settings")}>
        <ListItemIcon><Settings sx={{ color: "#fff" }} /></ListItemIcon>
        <Typography variant="body2">Settings</Typography>
      </MenuItem>

      <MenuItem onClick={handleLogout}>
        <ListItemIcon><Logout sx={{ color: "#fff" }} /></ListItemIcon>
        <Typography variant="body2">Logout</Typography>
      </MenuItem>
    </Menu>
  );
}
