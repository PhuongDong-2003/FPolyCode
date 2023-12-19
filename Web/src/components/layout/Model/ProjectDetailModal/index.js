import {
  AspectRatio,
  DialogTitle,
  Modal,
  ModalClose,
  ModalDialog,
} from "@mui/joy";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  DialogContent,
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useGetTechsQuery } from "../../../../api/tech.api";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { projectSchema } from "../../../../utils/rules";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import { v4 } from "uuid";
import {
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "../../../../api/project.api";
import { toastNotifi } from "../../../../utils/toast";
import { isNull, omitBy } from "lodash";

const VisualHiddenInput = styled("input")(() => ({
  clipPath: "inset(50%)",
  position: "absolute",
  bottom: 0,
  left: 0,
}));

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

const initResource = {
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

const ProjectDetailModal = ({ project, setSelected, handleClose }) => {
  const theme = useTheme();
  const matchDown = useMediaQuery(theme.breakpoints.down("md"));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {},
  });

  const [updateProjectFn, { isLoading }] = useUpdateProjectMutation();
  const [deleteProjectFn] = useDeleteProjectMutation();
  const { data: techsData } = useGetTechsQuery();
  const techs = techsData?.data || [];

  const [updateProject, setUpdateProject] = useState({
    title: project.title,
    github: project.description.github,
    isPublic: project.isPublic,
    selectedTechs: project.description.techs,
    thumbnail: project.thumbnail,
  });

  const [resource, setResource] = useState(initResource);

  const handleChangeThumbnail = (event) => {
    event.stopPropagation();
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

  const onSubmit = handleSubmit((data) => {
    updateProjectFn({
      data: {
        project_id: project.id,
        title: data.title,
        github: data.github,
        status: project.status,
        isPublic: updateProject.isPublic,
        techs: data.techs,
      },
      resource,
    })
      .unwrap()
      .then(() => {
        handleClose();
        setSelected([]);
        toastNotifi("Cập nhật dự án thành công", "success");
      })
      .catch(() => toastNotifi("Cập nhật thất bại", "error"));
    });
    
    const handleDeleteProject = () => {
      deleteProjectFn([project.id])
      .unwrap()
      .then(() => {
        handleClose();
        setSelected([]);
        toastNotifi("Xóa dự án thành công");
      })
      .catch(() => toastNotifi("Xóa dự án không thành công", "error"));
  };

  useEffect(() => {
    if (techs.length !== 0) {
      const newReference = project.description.techs.map((tech) => {
        const isExist = techs.some((item) => {
          if (item.id === tech.id) {
            tech = item;
            return true;
          }
          return false;
        });
        if (isExist) return tech;
      });

      setUpdateProject((previous) => ({
        ...previous,
        selectedTechs: newReference,
      }));
    }
  }, [techs, project]);

  useEffect(() => {
    setValue("title", updateProject.title);
    setValue("major", project.major);
    setValue("github", updateProject.github);
    setValue("censor", project.description.censor);
    setValue("techs", updateProject.selectedTechs);
  }, [setValue, updateProject, project]);

  return (
    <Fragment>
      <Modal open={true} onClose={handleClose}>
        <ModalDialog layout="fullscreen">
          <ModalClose />
          <DialogTitle
            sx={{ textTransform: "uppercase", alignItems: "center" }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: "0" }}>
              <EditIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary={"Sửa đổi dự án"} />
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ px: { xs: 2, md: 4 } }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5.5}>
                <Box sx={{ textTransform: "uppercase", mb: 2 }}>
                  <Typography>Tài nguyên</Typography>
                </Box>
                <Box
                  my={1}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                >
                  <AspectRatio ratio={"16/9"} sx={{ width: "100%" }}>
                    <Typography component={"div"} fontSize={"4rem"}>
                      <Box
                        component={"video"}
                        src={project.video}
                        controls
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                        }}
                      />
                    </Typography>
                  </AspectRatio>
                </Box>
                <Box>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          position: "relative",
                          "&:hover > .MuiButtonBase-root": {
                            top: "50%",
                            opacity: 1,
                          },
                        }}
                      >
                        <AspectRatio sx={{ width: "100%" }}>
                          <InputLabel sx={{ cursor: "pointer" }}>
                            <Card sx={{ height: "100%" }}>
                              <CardMedia
                                component="img"
                                image={
                                  resource.thumbnail.url || project.thumbnail
                                }
                                sx={{ height: "100%", objectFit: "cover" }}
                              />
                            </Card>
                            <VisualHiddenInput
                              type="file"
                              accept="image/*"
                              onChange={handleChangeThumbnail}
                            />
                          </InputLabel>
                        </AspectRatio>
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: "100%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            transition: "all 0.2s ease-in-out",
                            backgroundColor: "rgb(207, 202, 200, 0.1)",
                            boxShadow: "inset 0px 0px 8px 3px #C8C2C2",
                            zIndex: 1,
                            opacity: 0,
                          }}
                          onClick={(event) => {
                            event.stopPropagation();
                            setResource({
                              ...resource,
                              thumbnail: {
                                url: "",
                                data: null,
                              },
                            });
                          }}
                        >
                          <DeleteForeverRoundedIcon />
                        </IconButton>
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
                              Source
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
                <Box
                  sx={{
                    mb: 2,
                    textTransform: "uppercase",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>Thông tin cơ bản</Typography>
                  {updateProject.isPublic ? (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() =>
                        setUpdateProject({
                          ...updateProject,
                          isPublic: false,
                        })
                      }
                    >
                      Ẩn dự án
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        setUpdateProject({
                          ...updateProject,
                          isPublic: true,
                        })
                      }
                    >
                      Công khai
                    </Button>
                  )}
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
                  <TextField
                    fullWidth
                    variant="standard"
                    id="censor"
                    label="Người kiểm duyệt"
                    disabled
                    {...register("censor")}
                  />
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
                      value={updateProject.selectedTechs}
                      displayEmpty={true}
                      {...register("techs")}
                      onChange={(event) =>
                        setUpdateProject({
                          ...updateProject,
                          selectedTechs: event.target.value,
                        })
                      }
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
                    color="success"
                    startIcon={<TurnedInNotIcon />}
                    onClick={onSubmit}
                    disabled={isLoading}
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
                    Lưu
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<DeleteOutlineOutlinedIcon />}
                    disabled={isLoading}
                    onClick={handleDeleteProject}
                  >
                    Xóa dự án
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

export default ProjectDetailModal;
