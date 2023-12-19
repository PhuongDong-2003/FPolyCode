import {
  Avatar,
  Box,
  Chip,
  Grid,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { AspectRatio } from "@mui/joy";
import DownloadIcon from "@mui/icons-material/Download";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDateOrString, formatNumber } from "../../../../utils/format";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import {
  useGetProjectQuery,
  useUpdateProjectMutation,
  useUpdateViewProjectMutation,
} from "../../../../api/project.api";
import { useSelector } from "react-redux";

const ChipStyle = styled(Chip)(() => ({
  justifyContent: "space-between",
  "& .MuiChip-label": {
    display: "block",
    width: "100%",
    textAlign: "center",
  },
}));

const TableCellStyle = styled(TableCell)(() => ({
  border: "unset",
}));

const ContentSection = ({ projectID }) => {
  const theme = useTheme();
  const matchDown = useMediaQuery(theme.breakpoints.down("md"));
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  const { data: projectData } = useGetProjectQuery(projectID, {
    skip: !Boolean(projectID),
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 15000,
  });

  const project = projectData?.data;

  const [updateViewFn] = useUpdateViewProjectMutation();
  const [expandMore, setExpandMore] = useState(false);

  const videoRef = useRef(null);
  const [isIncrease, setIsIncrease] = useState(false);

  useEffect(() => { setIsIncrease(false) }, [projectID]);

  useEffect(() => {
    const videoEL = videoRef.current;

    const handleUpdate = async () => {
      const duration = videoEL.duration;
      if (!isIncrease && videoEL.currentTime >= (duration / 2)) {
        await updateViewFn({
          project_id: project.id,
          viewCount: project.description.view + 1,
        })
        setIsIncrease(true);
        videoEL.removeEventListener("timeupdate", handleUpdate);
      }
    }

    videoEL.addEventListener("timeupdate", handleUpdate);

    return () => {
      videoEL.removeEventListener("timeupdate", handleUpdate);
    }
  }, [isIncrease, updateViewFn, project])

  const handleDownload = () => {
    const sourceRef = ref(storage, project.source);

    getDownloadURL(sourceRef)
      .then((url) => {
        const link = document.createElement("a");
        link.href = url;
        link.click();
      })
      .catch((error) => alert(error));
  };

  return (
    <Box width={"100%"}>
      <AspectRatio
        ratio={matchDown ? 16 / 10 : 16 / 9}
        sx={{
          width: "100%",
          borderRadius: 10,
        }}
      >
        <video
          controls
          src={project?.video}
          style={{ objectFit: "fill" }}
          autoPlay
          ref={videoRef}
        />
      </AspectRatio>
      <Typography
        variant="caption"
        component={"div"}
        noWrap
        sx={{
          fontSize: "1.5rem",
          margin: theme.spacing(0.5, 0),
        }}
      >
        {project?.title}
      </Typography>
      <Box width={"100%"}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Stack direction={"row"} spacing={2}>
              <Avatar
                variant="circular"
                src={project?.student.avatar}
              />
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Typography variant="subtitle1" component={"div"}>
                  {project?.student.fullname}
                </Typography>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack
              direction={"row"}
              spacing={1}
              sx={{ justifyContent: { xs: "flex-start", md: "flex-end" } }}
            >
              <ChipStyle
                icon={<VisibilityIcon />}
                fontSize="small"
                label={formatNumber(project?.description.view) + " lượt xem"}
                variant="outlined"
                color="secondary"
              />
              {/* <ChipStyle
                icon={<FavoriteBorderIcon />}
                fontSize="small"
                label={formatNumber(project?.description.like) + " lượt thích"}
                variant="outlined"
                color="error"
                onClick={() => {}}
                disabled={!isAuthenticated}
              /> */}
              <ChipStyle
                icon={<DownloadIcon />}
                fontSize="small"
                label={"Tải xuống"}
                variant="outlined"
                color="info"
                onClick={handleDownload}
                disabled={!isAuthenticated}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          my: 2,
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          height: expandMore ? "auto" : 125,
          backgroundColor: "#F2F2F2",
        }}
      >
        <Box
          component={"div"}
          sx={{
            p: 1,
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCellStyle variant="head">Ngày đăng</TableCellStyle>
                <TableCellStyle>
                  {formatDateOrString(project?.description.create_at)}
                </TableCellStyle>
              </TableRow>
              <TableRow>
                <TableCellStyle variant="head">Chuyên ngành</TableCellStyle>
                <TableCellStyle>{project?.major}</TableCellStyle>
              </TableRow>
              <TableRow>
                <TableCellStyle variant="head">
                  Giảng viên hướng dẫn
                </TableCellStyle>
                <TableCellStyle>{project?.description.censor}</TableCellStyle>
              </TableRow>
              <TableRow>
                <TableCellStyle variant="head">
                  Công nghệ được sử dụng
                </TableCellStyle>
                <TableCellStyle>
                  {project?.description.techs
                    .map((tech) => tech.name)
                    .join(", ")}
                </TableCellStyle>
              </TableRow>
              <TableRow>
                <TableCellStyle variant="head">Github</TableCellStyle>
                <TableCellStyle>
                  <Link href={project?.description.github} target="_blank" underline="none">
                    {project?.description.github}
                  </Link>
                </TableCellStyle>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
        <IconButton
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            zIndex: 1,
          }}
          onClick={() => setExpandMore(!expandMore)}
        >
          {expandMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        {!expandMore && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(0, rgba(255, 255, 255, 1), rgba(223, 223, 223, 0))",
            }}
          />
        )}
      </Box>
      <Box width={"100%"}>
        <Typography variant="h6" component={"div"}>
          Bình luận:
        </Typography>
      </Box>
    </Box>
  );
};

export default ContentSection;
