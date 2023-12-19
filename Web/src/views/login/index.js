import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { BASE_URL } from "../../utils/consts";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/auth.api";
import { toastNotifi } from "../../utils/toast";
import { useDispatch } from "react-redux";
import { authenticated, profile } from "../../redux/slice/app/app.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../utils/rules";

const getOauthGoogleUrl = () => {
  const GOOGLE_CLIENT_ID =
    "44286010933-d6hclq767ielrfgndmr9s4ciqna2542u.apps.googleusercontent.com";
  const GOOGLE_AUTHORIZED_REDIRECT_URI = `${BASE_URL}/oauth/google`;
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

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

const loginSchema = userSchema.pick(["email", "password"]);

const LoginPage = () => {
  const theme = useTheme();
  const matchDown = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginFn, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(loginSchema),
    shouldFocusError: true,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit((data) => {
    loginFn({
      email: data.email,
      password: data.password,
    })
      .unwrap()
      .then((res) => {
        dispatch(authenticated(true));
        dispatch(profile(res.data.user));
        navigate("/home");
        toastNotifi("Đăng nhập thành công", "success");
      })
      .catch((error) => {
        if (error.status === 422) {
          const formError = error.data.data;
          Object.keys(formError).forEach((key) => {
            setError(key, {
              message: formError[key],
              type: "responseError",
            });
          });
        } else {
          toastNotifi(error.data.message, "error");
        }
      });
  });

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: `linear-gradient(-30deg, #CDCDCD, #D6F9F5)`,
      }}
    >
      <Box
        component={"div"}
        sx={{
          width: { xs: "75vw", md: 475 },
          padding: 5,
          backgroundColor: "white",
          borderRadius: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Grid container direction={"column"}>
          <Grid item xs={12}>
            <Box sx={{ padding: 3 }} textAlign={"center"}>
              <Typography variant={matchDown ? "h6" : "h4"} component={"h4"}>
                Đăng nhập để tiếp tục
              </Typography>
              <Typography
                variant={matchDown ? "body1" : "body2"}
                component={"p"}
              >
                Nhập tài khoản và mật khẩu của bạn để đăng nhập
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            {/* Email */}
            <Box sx={{ pb: 1 }}>
              <TextField
                fullWidth
                label="Email"
                variant="standard"
                size="large"
                {...register("email")}
              />
              <TypographyStyleError message={errors.email?.message} />
            </Box>

            {/* Password */}
            <Box sx={{ pb: 1 }}>
              <Box position={"relative"}>
                <TextField
                  fullWidth
                  label="Password"
                  variant="standard"
                  size="large"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <IconButton
                  size="small"
                  sx={{ position: "absolute", right: 0, bottom: 0 }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </Box>

              <TypographyStyleError message={errors.password?.message} />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ my: 1 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ my: 2 }}
            startIcon={<LoginIcon />}
            onClick={onSubmit}
          >
            Đăng nhập
          </Button>
          <Divider variant="fullWidth" />
          <Link
            to={getOauthGoogleUrl()}
            style={{ textDecoration: "none", color: "black" }}
          >
            <Button
              variant="contained"
              color="inherit"
              fullWidth
              sx={{ my: 2 }}
              startIcon={(() => (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 128 128"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#fff"
                    d="M44.59 4.21a63.28 63.28 0 0 0 4.33 120.9a67.6 67.6 0 0 0 32.36.35a57.13 57.13 0 0 0 25.9-13.46a57.44 57.44 0 0 0 16-26.26a74.33 74.33 0 0 0 1.61-33.58H65.27v24.69h34.47a29.72 29.72 0 0 1-12.66 19.52a36.16 36.16 0 0 1-13.93 5.5a41.29 41.29 0 0 1-15.1 0A37.16 37.16 0 0 1 44 95.74a39.3 39.3 0 0 1-14.5-19.42a38.31 38.31 0 0 1 0-24.63a39.25 39.25 0 0 1 9.18-14.91A37.17 37.17 0 0 1 76.13 27a34.28 34.28 0 0 1 13.64 8q5.83-5.8 11.64-11.63c2-2.09 4.18-4.08 6.15-6.22A61.22 61.22 0 0 0 87.2 4.59a64 64 0 0 0-42.61-.38"
                  />
                  <path
                    fill="#e33629"
                    d="M44.59 4.21a64 64 0 0 1 42.61.37a61.22 61.22 0 0 1 20.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 0 0-13.64-8a37.17 37.17 0 0 0-37.46 9.74a39.25 39.25 0 0 0-9.18 14.91L8.76 35.6A63.53 63.53 0 0 1 44.59 4.21"
                  />
                  <path
                    fill="#f8bd00"
                    d="M3.26 51.5a62.93 62.93 0 0 1 5.5-15.9l20.73 16.09a38.31 38.31 0 0 0 0 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 0 1-5.5-40.9"
                  />
                  <path
                    fill="#587dbd"
                    d="M65.27 52.15h59.52a74.33 74.33 0 0 1-1.61 33.58a57.44 57.44 0 0 1-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0 0 12.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68"
                  />
                  <path
                    fill="#319f43"
                    d="M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0 0 44 95.74a37.16 37.16 0 0 0 14.08 6.08a41.29 41.29 0 0 0 15.1 0a36.16 36.16 0 0 0 13.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 0 1-25.9 13.47a67.6 67.6 0 0 1-32.36-.35a63 63 0 0 1-23-11.59A63.73 63.73 0 0 1 8.75 92.4"
                  />
                </svg>
              ))()}
            >
              Đăng nhập với Google
            </Button>
          </Link>
        </Box>
        <Button
          sx={{
            float: "right",
            fontStyle: "italic",
            cursor: "pointer",
          }}
          color="secondary"
          endIcon={<KeyboardDoubleArrowRightIcon />}
          onClick={() => navigate("/home")}
        >
          Trang chủ
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
