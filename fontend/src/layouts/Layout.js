import React from "react";
import { Layout as AntLayout } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer } from "../components";

const { Content } = AntLayout;

function Layout() {
  const location = useLocation();

  // Các trang không hiển thị header và footer
  const hideHeaderFooter = [
    "/match",
    "/matches",
    "/messages",
    "/settings",
  ].includes(location.pathname);

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      {!hideHeaderFooter && <Header />}
      <Content style={{ flex: 1, paddingTop: hideHeaderFooter ? "0" : "50px" }}>
        <Outlet />
      </Content>
      {!hideHeaderFooter && <Footer />}
    </AntLayout>
  );
}

export default Layout;
