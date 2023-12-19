import { Avatar, Box, IconButton, InputBase, Menu, MenuItem, Typography, useTheme } from "@mui/material"
import { tokens, ColorModeContext } from "../../theme";
import { useContext, useState } from "react";

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";


export const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const profile = JSON.parse(localStorage.getItem("profile"))

    const handleLogout = () => {
        // Xóa thông tin người dùng từ local storage
        localStorage.removeItem('profile');


        window.location.href = '/login';
    };
    // DROP DOWN MENU
    const dropMenuItems = profile
        ? [
            { title: profile.fullname },
            { title: "Đăng Xuất", to: "/login" },
        ]
        : [{ title: "Đăng nhập", to: "/login" }];

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="10px" width="800px" marginLeft={50}>
                <InputBase sx={{ ml: 2, flex: 1, fontSize: "20px" }} placeholder="Search..." />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>
            {/* ICON */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark"
                        ? (<DarkModeOutlinedIcon />)
                        : (<LightModeOutlinedIcon />)
                    }
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <Box>
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        aria-label="Click để mở rộng"
                        title="Click để mở rộng"
                    >
                        {profile?.avatar ? (
                            <Avatar alt="avatar" src={profile.avatar} />
                        ) : (

                            <Avatar alt="avatar" src={`../../assets/user.png`} />
                            // Thay 'YourDefaultAvatarComponent' bằng thành phần hiển thị ảnh mặc định của bạn
                        )}

                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {dropMenuItems.map((item) => (
                            // Chỉ xử lý sự kiện onClick khi đây là mục "Đăng xuất"
                            item.title === 'Đăng Xuất' ? (
                                <MenuItem key={item.title} onClick={handleLogout}>
                                    <Typography>{item.title}</Typography>
                                </MenuItem>
                            ) : (
                                <Link
                                    key={item.title}
                                    to={item.to}
                                    style={{ textDecoration: "none", color: "#868dfb" }}
                                    onClick={handleClose} // Đóng menu khi người dùng chọn một mục khác "Đăng xuất"
                                >
                                    <MenuItem>
                                        <Typography>{item.title}</Typography>
                                    </MenuItem>
                                </Link>
                            )
                        ))}
                    </Menu>

                </Box>
                {/* <IconButton>
                    <PersonOutlinedIcon />
                </IconButton> */}
            </Box>
        </Box>
    )
}