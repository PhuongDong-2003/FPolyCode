import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Fragment, useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AspectRatio } from "@mui/joy";
import { formatDateOrString, formatNumber } from "../../../utils/format";
import { useNavigate } from "react-router-dom";
import ProjectDetailModal from "../../../components/layout/Model/ProjectDetailModal";
import { APPROVE_STATUS, mapStatus } from "../../../utils/consts";
import {
  useDeleteProjectMutation,
  useGetProjectOfUserQuery,
  useUpdateProjectMutation,
} from "../../../api/project.api";
import { toastNotifi } from "../../../utils/toast";

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
    align: "right",
    display: { xs: "none", md: "table-cell" },
    sortAble: true,
    collapseAble: true,
  },
  {
    id: "view",
    name: "Lượt xem",
    width: 80,
    align: "right",
    display: { xs: "none", md: "table-cell" },
    sortAble: true,
    collapseAble: true,
  },
  {
    id: "like",
    name: "Lượt thích",
    width: 80,
    align: "right",
    display: { xs: "none", md: "table-cell" },
    sortAble: true,
    collapseAble: true,
  },
];

const descendingComparator = (a, b, orderBy) => {
  if (a[orderBy] < b[orderBy]) {
    return 1;
  }
  return -1;
};

const getComparator = (orderBy, orderDirection) => {
  return orderDirection === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const EnhancedTableToolbar = ({ selected, setSelected, handleDelete }) => {
  const selectedCount = selected.length;
  const [modalDetail, setModalDetail] = useState(false);

  const handleCloseModalDetail = () => setModalDetail(false);

  return (
    <Toolbar>
      {selectedCount > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="h5"
          component="div"
        >
          {selectedCount} Selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          Dự án của tôi
        </Typography>
      )}

      {selectedCount > 0 ? (
        <Fragment>
          {selectedCount === 1 && (
            <Tooltip title="Chi tiết">
              <IconButton onClick={() => setModalDetail(true)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          )}
          {modalDetail && (
            <ProjectDetailModal
              project={selected[0]}
              setSelected={setSelected}
              handleClose={handleCloseModalDetail}
            />
          )}
          <Tooltip title="Xóa">
            <IconButton onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Fragment>
      ) : (
        <Tooltip>
          <IconButton>
            <TagFacesIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const EnhancedTableHead = (props) => {
  const {
    orderDirection,
    orderBy,
    rowCount,
    handleSort,
    selectedCount,
    handleSelectAllClick,
  } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell
          padding="none"
          align="center"
          sx={{ display: { xs: "table-cell", md: "none" } }}
        />
        <TableCell padding="checkbox" align="center">
          <Checkbox
            color="primary"
            onClick={handleSelectAllClick}
            indeterminate={selectedCount > 0 && selectedCount < rowCount}
            checked={rowCount > 0 && selectedCount === rowCount}
          />
        </TableCell>

        {columnsConfig.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            sx={{ width: column.width, display: column.display }}
          >
            {column.sortAble ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? orderDirection : "asc"}
                onClick={handleSort(column.id)}
              >
                {column.name}
              </TableSortLabel>
            ) : (
              column.name
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const EnhancedTableBody = (props) => {
  const { projects, handleClick, isSelected } = props;

  return (
    <TableBody>
      {projects.map((project) => {
        const isItemSelected = isSelected(project);
        return (
          <EnhancedTableRowBody
            key={project.id}
            project={project}
            isItemSelected={isItemSelected}
            handleClick={handleClick}
          />
        );
      })}
    </TableBody>
  );
};

const EnhancedTableRowBody = ({ project, isItemSelected, handleClick }) => {
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
      <TableRow
        hover
        key={project.id}
        onClick={handleClick(project)}
        selected={isItemSelected}
        sx={{ cursor: "pointer" }}
      >
        <TableCell sx={{ display: { xs: "table-cell", md: "none" }, p: 0.5 }}>
          <IconButton size="small" onClick={handleCollapse}>
            {isCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell padding="checkbox" align="center">
          <Checkbox color="primary" checked={isItemSelected} />
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
          align="right"
          sx={{ display: { xs: "none", md: "table-cell" } }}
        >
          {formatDateOrString(project.description.create_at)}
        </TableCell>

        <TableCell
          align="right"
          sx={{ display: { xs: "none", md: "table-cell" } }}
        >
          {formatNumber(project.description.view)}
        </TableCell>

        <TableCell
          align="right"
          sx={{ display: { xs: "none", md: "table-cell" } }}
        >
          {formatNumber(project.description.like)}
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

const ActiveProducts = () => {
  const { data: projectsData } = useGetProjectOfUserQuery({
    status: APPROVE_STATUS,
  });
  const projects = projectsData?.data || [];

  const [updateProductFn] = useUpdateProjectMutation();
  const [deleteProductFn] = useDeleteProjectMutation();

  const [orderDirection, setOrderDirection] = useState("asc");
  const [orderBy, setOrderBy] = useState("createDate");

  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleSort = (id) => () => {
    const isAsc = orderBy === id && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(id);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(projects);
    } else {
      setSelected([]);
    }
  };

  const handleClick = (project) => () => {
    const selectedIndex = selected.indexOf(project);
    let newSelected = [];

    if (selectedIndex < 0) {
      newSelected = newSelected.concat(selected, project);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleDelete = async () => {
    const ids = selected.map(({ id }) => id);
    deleteProductFn(ids)
      .unwrap()
      .then(() => {
        setSelected([]);
        toastNotifi("Xóa dự án thành công");
      })
      .catch(() => toastNotifi("Xóa dự án không thành công", "error"));
  };

  const isSelected = (video) => selected.indexOf(video) !== -1;

  const visibleProjects = useMemo(
    () =>
      [...projects]
        .sort(getComparator(orderBy, orderDirection))
        .slice(
          currentPage * rowsPerPage,
          currentPage * rowsPerPage + rowsPerPage
        ),
    [projects, orderBy, orderDirection, currentPage, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }} elevation={0} square={true}>
        <EnhancedTableToolbar
          selected={selected}
          setSelected={setSelected}
          handleDelete={handleDelete}
        />
        <TableContainer>
          <Table size="small" sx={{ overflow: "auto" }}>
            <EnhancedTableHead
              orderDirection={orderDirection}
              orderBy={orderBy}
              handleSort={handleSort}
              rowCount={projects.length}
              selectedCount={selected.length}
              handleSelectAllClick={handleSelectAllClick}
            />
            <EnhancedTableBody
              projects={visibleProjects}
              handleClick={handleClick}
              isSelected={isSelected}
            />
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={projects.length}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 35, 50]}
          onPageChange={(_, page) => setCurrentPage(page)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setCurrentPage(0);
          }}
          labelRowsPerPage={"Số hàng trên mỗi trang"}
          labelDisplayedRows={({ from, to, count }) =>
            `Đang xem từ ${from} đến ${to} trong ${count} mục`
          }
        />
      </Paper>
    </Box>
  );
};

export default ActiveProducts;
