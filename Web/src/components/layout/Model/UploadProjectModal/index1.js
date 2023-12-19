import {
  AspectRatio,
  DialogContent,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import React, { Fragment, useContext, useState } from "react";
import { UploadProjectModalContext } from "../../Header/PersonalSection/UploadVideo";
import CreateIcon from "@mui/icons-material/Create";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useGetTechsQuery } from "../../../../api/tech.api";
import { useGetCensorsQuery } from "../../../../api/user.api";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { projectSchema } from "../../../../utils/rules";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Draggable from "react-draggable";
// import VideoSnapshot from "video-snapshot";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { useCreateProjectMutation } from "../../../../api/project.api";
import { toastNotifi } from "../../../../utils/toast";

const TypographyStyleError = ({ message }) => {
  return (
    <Typography
      component={"p"}
      sx={{
        mt: 1,
        color: "red",
        fontStyle: "italic",
        fontWeight: 100,
        fontSize: "0.7rem",
        minHeight: "1.25rem",
      }}
    >
      {message}
    </Typography>
  );
};

export const VisualHiddenInput = styled("input")(() => ({
  clipPath: "inset(50%)",
  position: "absolute",
  bottom: 0,
  left: 0,
}));

const initResource = {
  video: {
    url: "",
    data: null,
  },
  thumbnail: {
    url: "",
    data: null,
  },
  source: {
    name: "",
    url: "",
    data: null,
  },
};

const UploadProjectModal1 = () => {
  const { isOpenModal, handleCloseModal } = useContext(
    UploadProjectModalContext
  );
  const profile = useSelector((state) => state.app.profile);

  const { data: techsData } = useGetTechsQuery();
  const { data: censorsData } = useGetCensorsQuery(
    { major: profile.major.id },
    { skip: profile === null }
  );
  const [createProjectFn, { isLoading }] = useCreateProjectMutation();

  const techs = techsData?.data || [];
  const censors = censorsData?.data || [];

  const [resource, setResource] = useState(initResource);
  const [selectedTechs, setSelectedTechs] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: "",
      major: profile.major.name,
      censor: null,
      techs: [],
      github: "",
    },
  });

  const handleChangeVideo = async (event) => {
    const file = event.target.files[0];
    if (file) {
      /* const snapshoter = new VideoSnapshot(file);
      const snapshots = [
        await snapshoter.takeSnapshot(0),
        await snapshoter.takeSnapshot(1),
        await snapshoter.takeSnapshot(5),
        await snapshoter.takeSnapshot(10),
      ]; */
      const url = URL.createObjectURL(file);
      setResource({
        ...resource,
        video: {
          url,
          data: file,
        },
      });
    }
  };

  const handleChangeThumbnail = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setResource({
        ...resource,
        thumbnail: {
          url,
          data: file,
        },
      });
    }
  };

  const handleChangeSource = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setResource({
        ...resource,
        source: {
          name: file.name,
          url,
          data: file,
        },
      });
    }
    event.target.value = null;
  };

  const handleCreateProject = (project) => {
    if (
      resource.video.data &&
      resource.thumbnail.data &&
      resource.source.data
    ) {
      createProjectFn({
        data: {
          title: project.title,
          major_id: profile.major.id,
          censor_id: project.censor.id,
          techs: project.techs,
          github: project.github,
        },
        resource,
      })
        .unwrap()
        .then(() => {
          window.location.reload();
          toastNotifi("Khởi tạo dự án thành công", "success");
        })
        .catch((error) => {
          toastNotifi(error.data.message, "error");
        });
    } else {
      toastNotifi("Tài nguyên dự án bỏ trống", "warning");
      return;
    }
  };

  return (
    <Fragment>
      <Modal open={isOpenModal} onClose={handleCloseModal}>
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <DialogTitle
            sx={{ textTransform: "uppercase", alignItems: "center" }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: "0" }}>
              <CreateIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary={"Tạo mới dự án"} />
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ px: { xs: 2, md: 4 } }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5.5}>
                <Box sx={{ textTransform: "uppercase", mb: 2 }}>Tài nguyên</Box>

                <Box
                  my={1}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                >
                  <AspectRatio ratio={"16/9"} sx={{ width: "100%" }}>
                    <Typography component={"div"} fontSize={"4rem"}>
                      {resource.video.url ? (
                        <Box
                          component={"video"}
                          src={resource.video.url}
                          controls
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "fill",
                          }}
                        />
                      ) : (
                        <PlayArrowRoundedIcon fontSize="inherit" />
                      )}
                    </Typography>
                    <Draggable>
                      <Button
                        component="label"
                        variant="contained"
                        size="large"
                        sx={{
                          position: "absolute",
                          width: "4rem",
                          height: "4rem",
                          lineHeight: "4rem",
                          borderRadius: "50%",
                        }}
                      >
                        <CloudUploadOutlinedIcon />
                        <VisualHiddenInput
                          type="file"
                          accept=".mp4"
                          onChange={handleChangeVideo}
                        />
                      </Button>
                    </Draggable>
                  </AspectRatio>
                  {/* <Box>
                    <Stack direction={"row"} spacing={1}>
                      {resource.video.snapshots.map((snapshot, index) => (
                        <Card
                          key={index}
                          sx={{
                            borderRadius: 1,
                            cursor: "pointer",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={snapshot}
                            sx={{ objectFit: "fill" }}
                            onClick={() =>
                              setResource({
                                ...resource,
                                thumbnail: {
                                  url: snapshot,
                                  data: snapshot,
                                },
                              })
                            }
                          />
                        </Card>
                      ))}
                    </Stack>
                  </Box> */}
                </Box>

                <Box>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                      <Box width={"100%"} height={"100%"}>
                        <AspectRatio sx={{ width: "100%" }}>
                          <InputLabel sx={{ cursor: "pointer" }}>
                            {!resource.thumbnail.url && (
                              <PhotoLibraryIcon fontSize="large" />
                            )}
                            {resource.thumbnail.url && (
                              <Card sx={{ height: "100%" }}>
                                <CardMedia
                                  component="img"
                                  image={resource.thumbnail.url}
                                  sx={{ height: "100%", objectFit: "cover" }}
                                />
                              </Card>
                            )}
                            <VisualHiddenInput
                              type="file"
                              accept="image/*"
                              onChange={handleChangeThumbnail}
                            />
                          </InputLabel>
                        </AspectRatio>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box
                        width={"100%"}
                        height={"100%"}
                        sx={{
                          border: { xs: "none", md: "1px dashed black" },
                          borderRadius: 1,
                          boxSizing: "border-box",
                        }}
                      >
                        <FormControl
                          fullWidth
                          sx={{
                            minHeight: { xs: "75px", md: "100%" },
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {!Boolean(resource.source.url) && (
                            <Button
                              component="label"
                              variant="outlined"
                              startIcon={<FileUploadRoundedIcon />}
                              sx={{ width: "fit-content" }}
                            >
                              Upload
                              <VisualHiddenInput
                                type="file"
                                name="source"
                                accept=".rar,.zip,.doc,.docx,.txt,.tar"
                                onChange={handleChangeSource}
                              />
                            </Button>
                          )}
                          {Boolean(resource.source.url) && (
                            <Box
                              display="flex"
                              sx={{
                                width: "95%",
                                border: "1px dashed black",
                                borderRadius: 1,
                                my: 1,
                              }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                flexGrow={1}
                                sx={{ overflow: "hidden", ml: 1, p: 1 }}
                              >
                                <Typography
                                  variant={"subtitle2"}
                                  component="div"
                                  sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {resource.source.name}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setResource({
                                    ...resource,
                                    source: {
                                      name: "",
                                      url: "",
                                      data: null,
                                    },
                                  });
                                }}
                              >
                                <DeleteForeverRoundedIcon />
                              </IconButton>
                            </Box>
                          )}
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} md={6.5}>
                <Box sx={{ textTransform: "uppercase", mb: 2 }}>
                  Thông tin cơ bản
                </Box>

                {/* Tiêu đề */}
                <Box sx={{ pb: 1 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="title"
                    label="Tiêu đề"
                    {...register("title")}
                  />
                  <TypographyStyleError message={errors.title?.message} />
                </Box>

                {/* Chuyên ngành */}
                <Box sx={{ pb: 1 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="major"
                    label="Chuyên ngành"
                    disabled
                    {...register("major")}
                  />
                  <TypographyStyleError message={errors.major?.message} />
                </Box>

                {/* Github */}
                <Box sx={{ pb: 1 }}>
                  <TextField
                    fullWidth
                    variant="standard"
                    id="github"
                    label="Link Github"
                    {...register("github")}
                  />
                  <TypographyStyleError message={errors.github?.message} />
                </Box>

                {/* Người kiểm duyệt */}
                <Box sx={{ pb: 1 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="censor-label">Người kiểm duyệt</InputLabel>
                    <Select
                      labelId="censor-label"
                      id="censor"
                      label="Người kiểm duyệt"
                      defaultValue={""}
                      {...register("censor")}
                    >
                      <MenuItem disabled>
                        <em>Placeholder</em>
                      </MenuItem>
                      {censors.map((censor) => (
                        <MenuItem key={censor.id} value={censor}>
                          {censor.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TypographyStyleError message={errors.censor?.message} />
                </Box>

                {/* Công nghệ sử dụng */}
                <Box sx={{ pb: 1 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="tech-label">Công nghệ sử dụng</InputLabel>
                    <Select
                      style={{ width: "100%" }}
                      multiple
                      id="techs"
                      value={selectedTechs}
                      displayEmpty={true}
                      {...register("techs")}
                      onChange={(event) => setSelectedTechs(event.target.value)}
                      renderValue={(selected) =>
                        selected?.map((tech) => tech.name).join(", ") || ""
                      }
                      MenuProps={{ style: { height: "300px" } }}
                    >
                      <MenuItem disabled>
                        <em>Placeholder</em>
                      </MenuItem>
                      {techs.map((tech) => (
                        <MenuItem key={tech.id} value={tech}>
                          {tech.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TypographyStyleError message={errors.techs?.message} />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 2,
                    width: "100%",
                    mt: 2,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={isLoading}
                    sx={{ flexGrow: 1 }}
                    onClick={handleSubmit(
                      (data) => handleCreateProject(data),
                      (error) => console.log(error)
                    )}
                  >
                    {isLoading && (
                      <CircularProgress
                        color="error"
                        size={20}
                        sx={{
                          p: 1,
                          position: "absolute",
                        }}
                      />
                    )}
                    Khởi tạo dự án
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={isLoading}
                    sx={{ flexGrow: 1 }}
                    onClick={() => {
                      setResource(initResource);
                      setSelectedTechs([]);
                      reset();
                    }}
                  >
                    Xóa tất cả
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Fragment>
  );
};

export default UploadProjectModal1;
