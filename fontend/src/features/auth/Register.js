import React from "react";
import { Form, Input, Button, Card, Typography, Space, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  UserAddOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../utils/notification";
import "./Register.css";

const { Title, Text, Link } = Typography;

function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      console.log("Register form submitted:", values);
      const { ...registerData } = values;
      console.log("Register data:", registerData);
      const response = await authService.register(registerData);
      console.log("Registration successful:", response);

      showSuccessNotification(
        "Đăng ký thành công",
        "Tài khoản của bạn đã được tạo! Vui lòng đăng nhập."
      );
      navigate("/login");
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      showErrorNotification(
        "Đăng ký thất bại",
        error.response?.data?.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Đăng ký thất bại:", errorInfo);
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <Card className="register-card" bordered={false}>
          <div className="register-header">
            <Title level={2} className="register-title">
              💕 Tham gia TinderApp
            </Title>
            <Text type="secondary" className="register-subtitle">
              Tạo tài khoản của bạn để bắt đầu hẹn hò
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="register-form"
          >
            <Form.Item
              label="Họ và tên"
              name="fullname"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên của bạn!",
                },
                {
                  min: 4,
                  message: "Họ và tên phải có ít nhất 4 ký tự!",
                },
                {
                  pattern: /^[\p{L}\s]+$/u,
                  message: "Họ và tên chỉ được chứa chữ cái và khoảng trắng!",
                },
              ]}
            >
              <Input
                prefix={<IdcardOutlined className="input-icon" />}
                placeholder="Nhập họ và tên"
                size="large"
                className="register-input"
              />
            </Form.Item>

            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập của bạn!",
                },
                {
                  min: 4,
                  message: "Tên đăng nhập phải có ít nhất 4 ký tự!",
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="input-icon" />}
                placeholder="Nhập tên đăng nhập"
                size="large"
                className="register-input"
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
                className="register-input"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận mật khẩu của bạn!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Hai mật khẩu bạn nhập không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Xác nhận mật khẩu"
                size="large"
                className="register-input"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<UserAddOutlined />}
                className="register-button"
                block
              >
                Tạo tài khoản
              </Button>
            </Form.Item>
          </Form>

          <Divider className="register-divider">
            <Text type="secondary">hoặc</Text>
          </Divider>

          <div className="login-section">
            <Text type="secondary">
              Bạn đã có tài khoản?{" "}
              <Link href="/login" className="login-link">
                Đăng nhập tại đây
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Register;
