import * as yup from "yup";

export const projectSchema = yup.object({
  title: yup
    .string()
    .required("Tiêu đề dự án không được bỏ trống")
    .max(255, "Độ dài tối đa 255 ký tự")
    .trim(),
  major: yup.string().required("Chuyên ngành không được bỏ trống"),
  censor: yup.mixed().required("Người kiểm duyệt không được bỏ trống"),
  techs: yup
    .array()
    .of(yup.object())
    .min(1, "Ít nhất 1 công nghệ được sử dụng"),
  github: yup.string(),
});

export const userSchema = yup.object({
  personId: yup // Mã số sinh viên hoặc giảng viên, không phải id lưu trong DB
    .string()
    .required("Mã định danh không được bỏ trống")
    .trim()
    .max(255, "Độ dài tối đa 255 ký tự"),
  name: yup.string().required("Tên không được bỏ trống"),
  email: yup
    .string()
    .required("Email không được bỏ trống")
    .min(5, "Độ dài từ 5 - 100 ký tự")
    .max(100, "Độ dài từ 5 - 100 ký tự"),
  phone: yup.string().required("Tên không được bỏ trống"),
  username: yup.string().required("Username không được bỏ trống"),
  password: yup
    .string()
    .required("Mật khẩu không được bỏ trống")
    .min(6, "Mật khẩu quá ngắn (6 - 50 ký tự)")
    .max(50, "Mật khẩu quá dài (6 - 50 ký tự)"),
  new_password: yup
    .string()
    .required("Mật khẩu mới không được bỏ trống")
    .min(6, "Mật khẩu quá ngắn (6 - 50 ký tự)")
    .max(50, "Mật khẩu quá dài (6 - 50 ký tự)")
    .notOneOf([yup.ref("password")], "Mật khẩu mới trùng mật khẩu cũ"),
  confirm_password: yup
    .string()
    .required("Mật khẩu xác nhận không được bỏ trống")
    .min(6, "Mật khẩu quá ngắn (6 - 50 ký tự)")
    .max(50, "Mật khẩu quá dài (6 - 50 ký tự)")
    .oneOf([yup.ref("new_password")], "Mật khẩu xác nhận không khớp"),
});
