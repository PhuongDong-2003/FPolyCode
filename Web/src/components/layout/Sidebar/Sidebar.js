import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import TvIcon from "@mui/icons-material/Tv";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import SupportIcon from "@mui/icons-material/Support";
import React, { Fragment, useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { appbarHeight, drawerWidth } from "../../../utils/consts";
import { NavLink, useNavigate } from "react-router-dom";
import { getRoleFromLS } from "../../../utils/utils";

const sidebarStructure = [
  {
    icon: <HomeIcon />,
    label: "Trang chủ",
    childrenItem: null,
    url: "./home",
    role: ["CENSOR", "STUDENT"],
  },
  {
    icon: <TvIcon />,
    label: "Dự án của tôi",
    childrenItem: [
      {
        icon: <AccountTreeIcon />,
        label: "Dự án hoạt động",
        url: "./my-videos/active",
      },
      {
        icon: <VideoLibraryIcon />,
        label: "Trạng thái",
        url: "./my-videos/status",
      },
    ],
    role: ["CENSOR", "STUDENT"],
  },
  {
    icon: <ListAltOutlinedIcon />,
    label: "Danh sách yêu cầu",
    childrenItem: [
      {
        icon: <PendingActionsOutlinedIcon />,
        label: "Yêu cầu đang chờ",
        url: "./request/latest",
      },
      {
        icon: <RuleOutlinedIcon />,
        label: "Yêu cầu đã xử lý",
        url: "./request/processed",
      },
    ],
    role: ["CENSOR"],
  },
  {
    icon: <SupportIcon />,
    label: "Hỗ trợ",
    childrenItem: null,
    url: "./support",
    role: ["CENSOR", "STUDENT"],
  },
];

const ItemSidebar = ({ item, order, position, handleOrder }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!item.childrenItem) {
      navigate(item.url);
    }
    handleOrder(position);
  };

  return (
    <Fragment>
      <ListItemButton key={item.icon} onClick={handleClick} sx={{ py: 2 }}>
        {item.childrenItem ? (
          <Fragment>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
            {item.childrenItem && (order === position ? <ExpandLess /> : <ExpandMore />)}
          </Fragment>
        ) : (
          <NavLink
            to={item.url}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              width: "100%",
              textDecoration: "none",
              color: isActive ? "#FF5733" : "#616161",
            })}
          >
            <ListItemIcon style={{ color: "inherit" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </NavLink>
        )}
      </ListItemButton>
      {item.childrenItem && (
        <Collapse in={order === position} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.childrenItem.map((children) => (
              <ListItemButton key={children.label}>
                <NavLink
                  to={children.url}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    paddingLeft: "1rem",
                    textDecoration: "none",
                    color: isActive ? "#FF5733" : "#616161",
                  })}
                >
                  <ListItemIcon style={{ color: "inherit" }}>
                    {children.icon}
                  </ListItemIcon>
                  <ListItemText primary={children.label} />
                </NavLink>
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </Fragment>
  );
};


const Sidebar = ({ drawerOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchUp = useMediaQuery(theme.breakpoints.up("md"));
  
  const role = getRoleFromLS();
  
  const [order, setOrder] = useState(0);

  const handleOrder = (value) => {
    if (value !== order) setOrder(value);
  };

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant={matchUp ? "persistent" : "temporary"}
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            color: theme.palette.text.primary,
            borderRight: "none",
            [theme.breakpoints.up("md")]: {
              top: appbarHeight,
            },
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        <Box component={"div"}>
          <List>
            {sidebarStructure
              .filter((item) => item.role.includes(role))
              .map((item, index) => (
                <ItemSidebar
                  key={item.label}
                  item={item}
                  order={order}
                  position={index}
                  handleOrder={handleOrder}
                />
              ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
