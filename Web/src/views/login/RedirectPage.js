import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLoginMutation } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import { authenticated, profile } from "../../redux/slice/app/app.slice";
import { toastNotifi } from "../../utils/toast";

const RedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginFn] = useLoginMutation();

  useEffect(() => {
    const email = searchParams.get("email");
    const password = searchParams.get("password");
    if (email === null || password === null) {
      navigate("/login");
    } else {
      loginFn({ email, password })
        .unwrap()
        .then((res) => {
          dispatch(authenticated(true));
          dispatch(profile(res.data.user));
          navigate("/home");
          toastNotifi("Đăng nhập thành công", "success");
        })
        .catch(() => {
          navigate("/login");
          toastNotifi("không thể xác thực người dùng", "error");
        });
    }
  }, [dispatch, loginFn, navigate, searchParams]);
  return <></>;
};

export default RedirectPage;
