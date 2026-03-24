import React, { useState } from "react";
import authService from "../../api/authService";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../utils/notification";

import { Form, Input, Button, Card, Typography, Space, Divider } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import "./Login.css";
import { useNavigate } from "react-router-dom";
const { Title, Text, Link } = Typography;
function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isCheck, setIsCheck] = useState(false);

  // Function to decode JWT token and extract role
  const decodeToken = (token) => {
    try {
      // JWT có format: header.payload.signature
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      console.log("🔓 Decoded token:", decoded);
      return decoded;
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      return null;
    }
  };

  const onFinish = (values) => {
    console.log("Login form submitted:", values);
    authService
      .login(values)
      .then(async (response) => {
        if (response?.data?.code === 200) {
          const token = response?.data?.result?.token;
          localStorage.setItem("token", token);

          // Decode token để lấy role
          const decodedToken = decodeToken(token);

          // Xử lý các trường hợp khác nhau của role trong token
          let role = null;
          if (decodedToken) {
            // Trường hợp 1: role trực tiếp
            if (decodedToken.role) {
              role = decodedToken.role;
            }
            // Trường hợp 2: authorities là array
            else if (
              Array.isArray(decodedToken.authorities) &&
              decodedToken.authorities.length > 0
            ) {
              role = decodedToken.authorities[0];
            }
            // Trường hợp 3: authorities là string
            else if (typeof decodedToken.authorities === "string") {
              role = decodedToken.authorities;
            }
            // Trường hợp 4: scope
            else if (decodedToken.scope) {
              role = decodedToken.scope;
            }
          }

          console.log("🔑 User role from token:", role);

          // Lưu role vào localStorage để sử dụng sau này
          if (role) {
            localStorage.setItem("userRole", role);
          }

          showSuccessNotification(
            "Đăng nhập thành công",
            "Chào mừng bạn quay lại! Đang chuyển hướng..."
          );

          // Kiểm tra role và chuyển hướng
          if (role === "ADMIN" || role === "ROLE_ADMIN") {
            console.log("🔑 Admin user detected, redirecting to /admin");
            navigate("/admin");
          } else {
            // User thường - kiểm tra đã hoàn thiện profile chưa
            const checkResponse = await checkUser();
            if (checkResponse) {
              navigate("/match");
            } else {
              navigate("/register-info");
            }
          }
        } else {
          showErrorNotification(
            "Đăng nhập thất bại",
            response?.data?.message ||
            "Tên đăng nhập hoặc mật khẩu không hợp lệ. Vui lòng thử lại."
          );
        }
      })
      .catch((error) => {
        console.error("Đăng nhập thất bại:", error);
        showErrorNotification(
          "Đăng nhập thất bại",
          error.response?.data?.message ||
          "Tên đăng nhập hoặc mật khẩu không hợp lệ. Vui lòng thử lại."
        );
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Đăng nhập thất bại:", errorInfo);
  };

  const checkUser = async () => {
    try {
      const response = await authService.check_user();
      console.log("checkUser response:", response);
      const userExists = response.data.result;
      setIsCheck(userExists);
      return userExists; // Return the boolean result
    } catch (error) {
      console.log("checkUser error:", error);
      return false; // Return false if there's an error
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <Title level={2} className="login-title">
              💕 Chào mừng trở lại
            </Title>
            <Text type="secondary" className="login-subtitle">
              Đăng nhập để tìm nửa kia hoàn hảo của bạn
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="login-form"
          >
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập của bạn!",
                },
                {
                  min: 3,
                  message: "Tên đăng nhập phải có ít nhất 3 ký tự!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Nhập tên đăng nhập"
                size="large"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu của bạn!",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Nhập mật khẩu"
                size="large"
                className="login-input"
              />
            </Form.Item>

            <Form.Item className="forgot-password-item">
              <Link
                onClick={() => navigate("/forgot-password")}
                className="forgot-password-link"
              >
                Quên mật khẩu?
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<LoginOutlined />}
                className="login-button"
                block
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <Divider className="login-divider">
            <Text type="secondary">hoặc</Text>
          </Divider>

          <div className="register-section">
            <Text type="secondary">
              Bạn chưa có tài khoản? {" "}
              <Link to="/register" className="register-link">
                Đăng ký tại đây
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;
