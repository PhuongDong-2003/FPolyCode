import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../../../utils/rules";
import { useUpdateProfileMutation } from "../../../../api/user.api";
import { toastNotifi } from "../../../../utils/toast";
import { useDispatch } from "react-redux";
import { profile } from "../../../../redux/slice/app/app.slice";

const passwordSchema = userSchema.pick([
  "password",
  "new_password",
  "confirm_password",
]);

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

const ChangePassword = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      password: "",
      new_password: "",
      confirm_password: "",
    },
    shouldFocusError: true,
  });

  const [updateProfileFn, { isLoading }] = useUpdateProfileMutation();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit((data) => {
    updateProfileFn({
      password: data.password,
      newPassword: data.new_password,
    })
      .unwrap()
      .then((res) => {
        reset();
        dispatch(profile(res));
        toastNotifi("Cập nhật thông tin thành cônn", "success");
      })
      .catch((error) => {
        if (error.status === 422) {
          const formError = error.data.data;
          Object.keys(formError).forEach((key) => {
            setError("password", {
              message: formError[key],
              type: "responseError",
            });
          });
        } else {
          toastNotifi(error.data.data.message, "error");
        }
      });
  });

  return (
    <Fragment>
      <Typography variant="h5" component={"div"} py={2}>
        Thay đổi mật khẩu
      </Typography>
      <Box sx={{ width: { xs: "100%", md: "50%" } }}>
        {/* Password */}
        <Box sx={{ pb: 1 }}>
          <Box position={"relative"}>
            <TextField
              fullWidth
              label="Mật khẩu cũ"
              variant="standard"
              size="large"
              type="password"
              {...register("password")}
            />
          </Box>

          <TypographyStyleError message={errors.password?.message} />
        </Box>

        {/* New Password */}
        <Box sx={{ pb: 1 }}>
          <Box position={"relative"}>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              variant="standard"
              size="large"
              type={showPassword ? "text" : "password"}
              {...register("new_password")}
            />
            <IconButton
              size="small"
              sx={{ position: "absolute", right: 0, bottom: 0 }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Box>

          <TypographyStyleError message={errors.new_password?.message} />
        </Box>

        {/* Confirm Password */}
        <Box sx={{ pb: 1 }}>
          <Box position={"relative"}>
            <TextField
              fullWidth
              label="Xác thực mật khẩu mới"
              variant="standard"
              size="large"
              type="password"
              {...register("confirm_password")}
            />
          </Box>

          <TypographyStyleError message={errors.confirm_password?.message} />
        </Box>
      </Box>
      <Stack direction={"row"} spacing={2}>
        <Button
          variant="contained"
          color="success"
          disabled={isLoading}
          onClick={onSubmit}
        >
          Cập nhật
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={isLoading}
          onClick={() => reset()}
        >
          Xóa tất cả
        </Button>
      </Stack>
    </Fragment>
  );
};

export default ChangePassword;
