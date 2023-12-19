import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  FormControl,
  IconButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Fragment, useMemo, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AspectRatio } from "@mui/joy";
import { formatDateOrString } from "../../../utils/format";
import DeniedModal from "../../../components/layout/Model/DeniedModal";
import { useNavigate } from "react-router-dom";
import { DENIED_STATUS, mapStatus } from "../../../utils/consts";
import { useGetProjectOfUserQuery } from "../../../api/project.api";

const columnsConfig = [
  {
    id: "product",
    name: "Sản phẩm",
    width: { xs: 86, sm: 100 },
    align: "left",
    display: "table-cell",
    sortAble: false,
    collapseAble: false,
  },
  {
    id: "name",
    name: "Tiêu đề",
    width: { xs: 200, sm: 300 },
    align: "left",
    display: "table-cell",
    sortAble: true,
    collapseAble: false,
  },
  {
    id: "censor",
    name: "Người kiểm duyệt",
    width: 150,
    align: "left",
    display: { xs: "none", md: "table-cell" },
    sortAble: false,
    collapseAble: true,
  },
  {
    id: "createDate",
    name: "Ngày tạo",
    width: 100,
    align: "left",
    display: { xs: "none", md: "table-cell" },
    sortAble: false,
    collapseAble: true,
  },
  {
    id: "status",
    name: "Trạng thái",
    width: 80,
    align: "center",
    display: { xs: "none", md: "table-cell" },
    sortAble: false,
    collapseAble: true,
  },
];

const EnhancedTableToolbar = (props) => {
  const { filterStatus, handleChangeStatus } = props;

  return (
    <Toolbar
      sx={{
        flexWrap: "wrap",
        p: { xs: "0 !important", md: "2 !important" },
      }}
    >
      <Typography flexGrow={1} color="inherit" variant="h5" component="div">
        Video có trạng thái
      </Typography>
      <Box sx={{ width: { xs: "100%", md: 375 } }}>
        <FormControl sx={{ m: 1, width: "100%", mx: 0 }}>
          <Select
            fullWidth
            multiple
            size="small"
            value={filterStatus}
            onChange={handleChangeStatus}
            renderValue={(selected) => (
              <Stack direction={"row"} spacing={1}>
                {selected.map((status) => (
                  <Chip
                    key={status}
                    label={mapStatus.get(status).label}
                    sx={{
                      backgroundColor: mapStatus.get(status).color,
                      minWidth: 100,
                    }}
                  />
                ))}
              </Stack>
            )}
          >
            {Array.from(mapStatus.keys()).map((key) => (
              <MenuItem key={key} value={key}>
                <Checkbox checked={filterStatus.indexOf(key) > -1} />
                <ListItemText primary={mapStatus.get(key).label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Toolbar>
  );
};

const EnhancedTableHead = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell
          padding="none"
          align="center"
          sx={{ display: { xs: "table-cell", md: "none" } }}
        />

        {columnsConfig.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            sx={{ width: column.width, display: column.display }}
          >
            {column.name}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const EnhancedTableBody = (props) => {
  const { projects } = props;

  return (
    <TableBody>
      {projects.map((project) => (
        <EnhancedTableRowBody key={project.id} project={project} />
      ))}
    </TableBody>
  );
};

const EnhancedTableRowBody = ({ project }) => {
  const navigate = useNavigate();
  const [isCollapse, setIsCollapse] = useState(false);

  const handleCollapse = (event) => {
    event.stopPropagation();
    setIsCollapse(!isCollapse);
  };

  const handleClickVideo = (event) => {
    event.stopPropagation();
    navigate(`../../projects/${project.id}`);
  };

  return (
    <Fragment>
      {/* Main */}
      <TableRow hover key={project.id} sx={{ cursor: "pointer" }}>
        <TableCell
          sx={{
            p: 0.5,
            width: "1px !important",
            display: { xs: "table-cell", md: "none" },
          }}
        >
          <IconButton size="small" onClick={handleCollapse}>
            {isCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell>
          <AspectRatio sx={{ width: "100%" }}>
            <Box
              component={"img"}
              src={project.thumbnail}
              sx={{
                width: "100%",
                objectFit: "cover",
                borderRadius: { xs: "unset", sm: 2 },
              }}
            />
          </AspectRatio>
        </TableCell>

        <TableCell>
          <Box
            component={"div"}
            width={"100%"}
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            <Tooltip title={project.title}>
              <Typography
                variant="subtitle1"
                component={"span"}
                onClick={handleClickVideo}
              >
                {project.title}
              </Typography>
            </Tooltip>
          </Box>
        </TableCell>

        <TableCell
          align="left"
          sx={{ display: { xs: "none", md: "table-cell" } }}
        >
          {project.description.censor}
        </TableCell>

        <TableCell
          align="left"
          sx={{ display: { xs: "none", md: "table-cell" } }}
        >
          {formatDateOrString(project.description.create_at)}
        </TableCell>

        <TableCell
          align="center"
          sx={{ display: { xs: "none", md: "table-cell" } }}
        >
          {project.status === DENIED_STATUS ? (
            <DeniedModal
              label={mapStatus.get(project.status).label}
              sx={{
                backgroundColor: mapStatus.get(project.status).color,
                minWidth: 100,
              }}
              project_id={project.id}
            />
          ) : (
            <Chip
              label={mapStatus.get(project.status).label}
              sx={{
                backgroundColor: mapStatus.get(project.status).color,
                minWidth: 100,
              }}
            />
          )}
        </TableCell>
      </TableRow>

      {/* Collapse */}
      <TableRow sx={{ display: { md: "none" } }}>
        <TableCell colSpan={columnsConfig.length + 1} sx={{ p: 0, border: 0 }}>
          <Collapse in={isCollapse} timeout={"auto"} unmountOnExit>
            <Table size="medium">
              <TableBody>
                <TableRow>
                  <TableCell variant="head">Người kiểm duyệt</TableCell>
                  <TableCell>{project.description.censor}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Ngày tạo</TableCell>
                  <TableCell>
                    {formatDateOrString(project.description.create_at)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head">Trạng thái</TableCell>
                  <TableCell>
                    <Chip
                      label={mapStatus.get(project.status).label}
                      sx={{
                        backgroundColor: mapStatus.get(project.status).color,
                        minWidth: 100,
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

const StatusProducts = () => {
  const [filterStatus, setFilterStatus] = useState(["ALL"]);

  const { data: projectsData } = useGetProjectOfUserQuery({
    status: filterStatus,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangeStatus = (event) => {
    const status = event.target.value;
    if (status.length) {
      if (status[status.length - 1] === "ALL") {
        setFilterStatus(["ALL"]);
      } else {
        const newStatus = [];
        for (const stt of status) {
          if (stt !== "ALL") newStatus.push(stt);
        }
        setFilterStatus(newStatus);
      }
    } else {
      setFilterStatus(["ALL"]);
    }
  };

  const visibleProjects = useMemo(() => {
    const projects = projectsData?.data || [];

    return projects.slice(
      currentPage * rowsPerPage,
      currentPage * rowsPerPage + rowsPerPage
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsData, currentPage, rowsPerPage]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }} elevation={0} square={true}>
        <EnhancedTableToolbar
          filterStatus={filterStatus}
          handleChangeStatus={handleChangeStatus}
        />
        <TableContainer>
          <Table size="small" sx={{ overflow: "auto" }}>
            <EnhancedTableHead />
            <EnhancedTableBody projects={visibleProjects} />
          </Table>
        </TableContainer>
        <TablePagination
          count={visibleProjects.length}
          page={currentPage}
          component={"div"}
          rowsPerPage={5}
          rowsPerPageOptions={[5, 10, 20, 35, 50]}
          onPageChange={(_, page) => setCurrentPage(page)}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(Number(event.target.value))
          }
          labelRowsPerPage={"Số hàng trên mỗi trang"}
          labelDisplayedRows={({ from, to, count }) =>
            `Đang xem từ ${from} đến ${to} trong ${count}`
          }
        />
      </Paper>
    </Box>
  );
};

export default StatusProducts;
