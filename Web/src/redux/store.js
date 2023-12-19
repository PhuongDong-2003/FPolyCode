import { configureStore } from "@reduxjs/toolkit";
import authApi from "../api/auth.api";
import feedbackApi from "../api/feedback.api";
import majorApi from "../api/major.api";
import projectApi from "../api/project.api";
import techApi from "../api/tech.api";
import userApi from "../api/user.api";
import appReducer from "../redux/slice/app/app.slice"

const store = configureStore({
  reducer: {
    app: appReducer,
    [authApi.reducerPath]: authApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [majorApi.reducerPath]: majorApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [techApi.reducerPath]: techApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      feedbackApi.middleware,
      majorApi.middleware,
      projectApi.middleware,
      techApi.middleware,
      userApi.middleware
    ),
});

export default store;
