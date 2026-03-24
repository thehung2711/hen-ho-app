import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  HeartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const { Header, Sider, Content } = Layout;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Bảng Điều Khiển",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Người Dùng",
    },
    {
      key: "/admin/interests",
      icon: <HeartOutlined />,
      label: "Sở Thích",
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      navigate("/login");
    } else {
      navigate(key);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="admin-logo">
          <HeartOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
          {!collapsed && <span>Quản trị User</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
        <div className="admin-logout">
          <Menu
            theme="dark"
            mode="inline"
            items={[
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Đăng Xuất",
              },
            ]}
            onClick={handleLogout}
          />
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            alignItems: "center",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
              style: {
                fontSize: "18px",
                padding: "0 24px",
                cursor: "pointer",
              },
            }
          )}
        </Header>1
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
