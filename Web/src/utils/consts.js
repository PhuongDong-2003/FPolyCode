export const appbarHeight = 70;

export const drawerWidth = 270;

export const PENDING_STATUS = "PENDING";

export const APPROVE_STATUS = "APPROVE";

export const DENIED_STATUS = "DENIED";

export const STUDENT_ROLE = "STUDENT";

export const CENSOR_ROLE = "CENSOR";

export const mapStatus = new Map(
  Object.entries({
    [APPROVE_STATUS]: { label: "Đã duyệt", color: "#00E671" },
    [PENDING_STATUS]: { label: "Chờ duyệt", color: "#F8CD1D" },
    [DENIED_STATUS]: { label: "Từ chối", color: "#F3292A" },
    ALL: { label: "Tất cả", color: "#00C0E9" },
  })
);

export const BASE_URL = "http://localhost:8080/api";
// export const BASE_URL = "http://localhost:3030";
// export const BASE_URL = "http://192.168.157.19:8080/api";