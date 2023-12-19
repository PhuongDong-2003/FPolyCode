import {
  Avatar,
  Box,
  ButtonBase,
  ClickAwayListener,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  useTheme,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../../../../api/auth.api";
import { toastNotifi } from "../../../../../utils/toast";

const Account = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [logoutFn] = useLogoutMutation();

  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const profile = useSelector((state) => state.app.profile);

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpenAnchor = Boolean(anchorEl);

  const handleOpenAnchor = (event) => setAnchorEl(event.currentTarget);
  const handleCloseAnchor = () => setAnchorEl(null);

  const handleLogout = () => {
    logoutFn()
      .unwrap()
      .then(() => window.location.reload())
      .catch(() => toastNotifi("Đã có lỗi gì đó", "error"));
  };

  return (
    <Fragment>
      <ButtonBase
        sx={{ position: "relative", overflow: "hidden", borderRadius: "50%" }}
        onClick={handleOpenAnchor}
      >
        {isAuthenticated ? (
          <Avatar src={profile.avatar} />
        ) : (
          <AccountCircleIcon sx={{ width: "40px", height: "40px" }} />
        )}
      </ButtonBase>
      <Popper
        open={isOpenAnchor}
        anchorEl={anchorEl}
        placement="bottom-end"
        sx={{ zIndex: 9999 }}
      >
        <Paper elevation={5}>
          {isAuthenticated ? (
            <ClickAwayListener onClickAway={handleCloseAnchor}>
              <List sx={{ minWidth: 250 }}>
                <ListItemButton onClick={() => navigate("./user/profile")}>
                  <ListItemIcon>
                    <AccountCircleOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>Tài khoản của tôi</ListItemText>
                </ListItemButton>
                <Divider />
                <ListItemButton>
                  <ListItemIcon>
                    <HelpOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>Trợ giúp</ListItemText>
                </ListItemButton>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>Đăng xuất</ListItemText>
                </ListItemButton>
              </List>
            </ClickAwayListener>
          ) : (
            <ClickAwayListener onClickAway={handleCloseAnchor}>
              <List sx={{ minWidth: 250 }}>
                <ListItemButton onClick={() => navigate("/login")}>
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText>Đăng nhập</ListItemText>
                </ListItemButton>
                <Divider />
                <ListItemButton>
                  <ListItemIcon>
                    <HelpOutlineOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText>Trợ giúp</ListItemText>
                </ListItemButton>
              </List>
            </ClickAwayListener>
          )}
        </Paper>
      </Popper>
    </Fragment>
  );
};

export default Account;
