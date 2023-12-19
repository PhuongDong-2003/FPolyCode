import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
// ICONS
import { useState, useEffect } from 'react';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Header from "../../components/Header";
import { StatItem } from "../../components/StatItem";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';







export const Dashboard = () => {


    const [reportData, setReportData] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/projects/reportView');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                data.data.forEach((report, index) => {
                    report.stt = index + 1; // Tạo trường stt dựa trên index

                    return report;
                });

                console.log(data);
                setReportData(data.data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchData();
    }, []);


    const columns = [
        { field: 'stt', headerName: 'STT', width: 70 },
        { field: 'projectName', headerName: 'Tiêu đề sản phẩm dự án', width: 300 },
        { field: 'major', headerName: 'Chuyên ngành', width: 150 },
        { field: 'fullName', headerName: 'Tác giả', width: 150 },
        { field: 'view', headerName: 'Số lượng truy cập', type: 'number', width: 100 },
        { field: '', headerName: '', type: 'number', width: 100 },
        { field: 'approvalDate', headerName: 'Ngày Được Duyệt', type: 'date', width: 170 },
    ]


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* HEADER LINE */}
                <Header title="THỐNG KÊ TỔNG QUÁT" subtitle="Chào mừng bạn trở lại!" />

                {/* BUTTON DOWN */}

            </Box>
            {/* BIEU DO & DATA */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px" gap="20px">
                {/* CHARTS */}
                {/* <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <StatItem
                        title="12,361"
                        subtitle="Mentors thêm mới"
                        progress="0.75"
                        increase="+14%"
                        icon={
                            <PersonAddAltIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <StatItem
                        title="32,441"
                        subtitle="Sinh viên thêm mới"
                        progress="0.30"
                        increase="+5%"
                        icon={
                            <PersonAddIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <StatItem
                        title="431,225"
                        subtitle="Sản phẩm đăng tải mới"
                        progress="0.50"
                        increase="+21%"
                        icon={
                            <VideoCallIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <StatItem
                        title="1,325,134"
                        subtitle="Lượt tải xuống"
                        progress="0.80"
                        increase="+43%"
                        icon={
                            <FileDownloadIcon
                                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                            />
                        }
                    />
                </Box> */}
                {/* DATA TABLE */}
                <Box
                    gridColumn="span 12"
                    gridRow="span 3"
                    backgroundColor={colors.primary[400]}
                    p="30px"
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: colors.blueAccent[700],
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-footerContainer": {
                            borderTop: "none",
                            backgroundColor: colors.blueAccent[700],
                        },
                    }}
                >
                    <Typography variant="h5" fontWeight="600" paddingBottom={2}>
                        Danh sách sản phẩm có lượt truy cập nhiều nhất
                    </Typography>
                    <DataGrid
                        getRowId={(report) => report.stt}
                        rows={reportData}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}

                    />
                </Box>

            </Box>

        </Box>
    )
}