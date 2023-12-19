import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  InputLabel,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { Fragment, useState } from "react";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { useForm } from "react-hook-form";
import { AspectRatio } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { profile as profileAction } from "../../../../redux/slice/app/app.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../../../utils/rules";
import { useUpdateProfileMutation } from "../../../../api/user.api";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import { v4 } from "uuid";
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

const VisualHiddenInput = styled("input")(() => ({
  clipPath: "inset(50%)",
  position: "absolute",
  bottom: 0,
  left: 0,
}));

const initAvatar = {
  url: "",
  data: null,
};

const profileSchema = userSchema.pick([
  "personId",
  "name",
  "email",
  "phone",
  "username",
]);

const uploadToCloud = async (data) => {
  const avatarRef = ref(storage, `avatar/${v4()}`);
  const task = await uploadBytes(avatarRef, data);
  const url = await getDownloadURL(task.ref);
  return url;
};

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.app.profile);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      personId: profile.personId,
      name: profile.fullname,
      email: profile.email,
      phone: profile.phone,
      username: profile.username,
    },
  });

  const [updateProfileFn, { isLoading }] = useUpdateProfileMutation();

  const [avatar, setAvatar] = useState(initAvatar);

  const handleChangeAvatar = (event) => {
    const file = event.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar({
        url,
        data: file,
      });
    }
  };

  const handleDeleteAvatar = (event) => {
    event.stopPropagation();
    setAvatar({
      url: "",
      data: null,
    });
  };

  const onSubmit = handleSubmit((data) => {
    updateProfileFn({
      ...data,
      avatar: avatar.data,
    })
      .unwrap()
      .then((res) => {
        setAvatar(initAvatar);
        dispatch(profileAction(res));
        toastNotifi("Cập nhật thông tin thành cônn", "success");
      })
      .catch((error) => console.log(error));
  });

  return (
    <Fragment>
      <Typography variant="h5" component={"div"} py={2}>
        Thông tin tài khoản
      </Typography>
      <Box
        sx={{
          width: { xs: 100, md: 150 },
          height: { xs: 100, md: 150 },
          my: 1,
          overflow: "hidden",
          borderRadius: 2,
          position: "relative",
          "&:hover > .MuiButtonBase-root": {
            top: "50%",
            opacity: 1,
          },
        }}
      >
        <AspectRatio ratio={1 / 1} sx={{ width: "100%" }}>
          <InputLabel sx={{ bgcolor: "#CBD1CC", cursor: "pointer" }}>
            <Card sx={{ width: "100%", height: "100%" }}>
              <CardMedia
                component="img"
                image={avatar.url || profile.avatar}
                sx={{ height: "100%", objectFit: "cover" }}
              />
            </Card>
            <VisualHiddenInput
              type="file"
              accept="image/*"
              onChange={handleChangeAvatar}
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
          onClick={handleDeleteAvatar}
        >
          <DeleteForeverRoundedIcon />
        </IconButton>
      </Box>
      <Box>
        <Grid container p={2} pl={0} spacing={1}>
          <Grid item xs={12} md={6}>
            <Box>
              <TextField
                fullWidth
                label="Mã số"
                variant="standard"
                size="large"
                disabled
                {...register("personId")}
              />
              <TypographyStyleError message={errors.personId?.message} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <TextField
                fullWidth
                label="Tên"
                variant="standard"
                size="large"
                {...register("name")}
              />
              <TypographyStyleError message={errors.name?.message} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <TextField
                fullWidth
                label="Email"
                variant="standard"
                size="large"
                disabled
                {...register("email")}
              />
              <TypographyStyleError message={errors.email?.message} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <TextField
                fullWidth
                label="Số điện thoại"
                variant="standard"
                size="large"
                {...register("phone")}
              />
              <TypographyStyleError message={errors.phone?.message} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <TextField
                fullWidth
                label="Username"
                variant="standard"
                size="large"
                disabled
                {...register("username")}
              />
              <TypographyStyleError message={errors.username?.message} />
            </Box>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="success"
          sx={{ my: 2, position: "relative" }}
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
          Cập nhật
        </Button>
      </Box>
    </Fragment>
  );
};

export default Profile;
