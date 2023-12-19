import { useState } from "react";
import React from 'react';
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Sidebar } from "./pages/global/Sidebar";
import { Topbar } from "./pages/global/Topbar";
import { Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { FAQ } from "./pages/faq";
import { Form } from "./pages/form";
import { List } from "./pages/list";

import { Chart } from "./pages/chart";
import { Profile } from "./pages/profile";
import { ChangeInfo } from "./pages/changeinfo";
import { Auth } from "./components/Auth";
import { EditUserPage } from "./components/EditUserPage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { boolean } from "yup";


const ProtectedRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("profile"))
  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
};

const RejectedRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("profile"))
  return !isAuthenticated ? <Outlet /> : <Navigate to={"/"} />;
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const hasRefreshed = localStorage.getItem("refreshedOnce");
    if (location.pathname === "/login" && !hasRefreshed) {
      localStorage.setItem("refreshedOnce", "true");
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Refresh sau 1 giây khi vào trang login
    }
  }, [location.pathname]);
  return (

    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <div className="app" >
            {window.location.pathname !== "/login" && ( // Kiểm tra nếu không ở trang login thì hiển thị sidebar và topbar
              <React.Fragment>
                <Sidebar isSidebar={isSidebar} />
                <main className="content">
                  <Topbar setIsSidebar={setIsSidebar} />
                  <Routes>
                    {/* Các routes khác */}
                    <Route path="/" element={<ProtectedRoute />} >
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/list" element={<List />} />
                      <Route path="/form" element={<Form />} />
                      <Route path="/chart" element={<Chart />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/change" element={<ChangeInfo />} />
                      <Route path="/edit-user/:userId" element={<EditUserPage />} />
                    </Route>
                  </Routes>
                </main>
              </React.Fragment>
            )}

            <Routes>
              {/* Route cho trang đăng nhập */}
              <Route path="/login" element={<Auth />} />

              {/* Redirect đến trang Dashboard nếu người dùng truy cập vào một route không hợp lệ */}

            </Routes>
          </div>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>


  );
}

export default App;
