import { Box } from "@mui/material";
import React, { Fragment } from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabsStructure = [
  {
    url: "/user/profile",
    name: "Sửa hồ sơ",
  },
  {
    url: "/user/change-password",
    name: "Đổi mật khẩu",
  },
];

const UserLayout = () => {
  const tabs = tabsStructure.map((tab) => (
    <NavLink
      to={tab.url}
      key={tab.url}
      style={({ isActive }) => ({
        display: "inline-block",
        padding: "8px 16px",
        textDecoration: "none",
        textTransform: "uppercase",
        font: "normal 500 1rem sans-serif",
        boxSizing: "border-box",
        borderBottom: isActive ? "3px solid red" : "unset",
        color: isActive ? "red" : "black",
      })}
    >
      {tab.name}
    </NavLink>
  ));

  return (
    <Fragment>
      {/* nav */}
      <Box
        sx={{
          bgcolor: "unset",
          borderBottom: "1px solid #C2C2C2",
          boxShadow: "unset",
          boxSizing: "border-box",
        }}
      >
        <Box>{tabs}</Box>
      </Box>

      <Box py={4}>
        <Outlet />
      </Box>
    </Fragment>
  );
};

export default UserLayout;
