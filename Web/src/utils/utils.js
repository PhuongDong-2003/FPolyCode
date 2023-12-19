import { CENSOR_ROLE, STUDENT_ROLE } from "./consts";

export const getAccessTokenFromLS = () =>
  localStorage.getItem("access_token") || "";

export const setAccessTokenToLS = (token) => {
  localStorage.setItem("access_token", token);
};

export const getRefreshTokenFromLS = () =>
  localStorage.getItem("refresh_token") || "";

export const setRefreshTokenToLS = (token) => {
  localStorage.setItem("access_token", token);
};

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const setProfileToLS = (profile) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};

export const getRoleFromLS = () => {
  const result = localStorage.getItem("profile");
  const isCensor = result
    ? JSON.parse(result).roles.some((role) => role.name === CENSOR_ROLE)
    : false;
  return isCensor ? CENSOR_ROLE : STUDENT_ROLE;
};

export const clearLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
};
