import React from "react";
import { Layout, Button, Space, Typography } from "antd";
import { UserOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

function Header() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <AntHeader className="header">
      <div className="header-content">
        <div className="logo-section">
          <Title level={2} className="app-logo" onClick={handleLogoClick}>
            💕 Hẹn hò
          </Title>
        </div>

        <div className="auth-buttons">
          <Space size="middle">
            <Button
              type="default"
              size="large"
              icon={<LoginOutlined />}
              onClick={handleLogin}
              className="login-btn"
            >
              Đăng nhập
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<UserOutlined />}
              onClick={handleRegister}
              className="register-btn"
            >
              Đăng ký
            </Button>
          </Space>
        </div>
      </div>
    </AntHeader>
  );
}

export default Header;
