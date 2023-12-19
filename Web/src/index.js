import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./views/Home";
import VideoDetail from "./components/video/VideoDetail";
import ActiveProducts from "./views/MyProducts/ActiveProducts";
import StatusProducts from "./views/MyProducts/StatusProducts";
import LoginPage from "./views/login";
import { Provider, useSelector } from "react-redux";
import Support from "./views/Support";
import LatestRequest from "./views/RequestUpload/LatestRequest";
import ProcessedRequest from "./views/RequestUpload/ProcessedRequest";
import Profile from "./views/MyAccount/pages/Profile";
import Search from "./views/Search";
import store from "./redux/store";
import UserLayout from "./views/MyAccount/layout";
import ChangePassword from "./views/MyAccount/pages/ChangePassword";
import RedirectPage from "./views/login/RedirectPage";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
};

const RejectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.app.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to={"/home"} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="my-videos" element={<ProtectedRoute />}>
            <Route path="*" element={<ActiveProducts />} />
            <Route path="active" element={<ActiveProducts />} />
            <Route path="status" element={<StatusProducts />} />
          </Route>
          <Route path="projects/:projectID" element={<VideoDetail />} />
          <Route path="request" element={<ProtectedRoute />}>
            <Route path="*" element={<LatestRequest />} />
            <Route path="latest" element={<LatestRequest />} />
            <Route path="processed" element={<ProcessedRequest />} />
          </Route>
          <Route path="" element={<ProtectedRoute />}>
            <Route path="user" element={<UserLayout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
          </Route>
          <Route path="support" element={<Support />} />
          <Route path="search" element={<Search />} />
          <Route path="*" element={<Home />} />
        </Route>
        <Route path="/" element={<RejectedRoute />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
        <Route path="redirect" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
