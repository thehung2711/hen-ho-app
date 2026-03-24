import React, { useState } from "react";
import authService from "../../api/authService/authService";
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../utils/notification";
import { Form, Input, Button, Card, Typography, Space, Result } from "antd";
import { MailOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import "./Login.css"; // Sử dụng chung CSS với Login
import { useNavigate } from "react-router-dom";

const { Title, Text, Link } = Typography;

function ForgotPassword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onFinish = async (values) => {
    console.log("Forgot password form submitted:", values);
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(values.email);

      if (response?.data?.code === 200) {
        setIsSuccess(true);
        showSuccessNotification(
          "Đã gửi Email",
          "Mật khẩu mới đã được gửi đến địa chỉ email của bạn."
        );
        form.resetFields();

        // Tự động chuyển về trang login sau 3 giây
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        showErrorNotification(
          "Thất bại",
          response?.data?.message || "Email không tồn tại trong hệ thống."
        );
      }
    } catch (error) {
      console.error("Lấy lại mật khẩu thất bại:", error);
      showErrorNotification(
        "Thất bại",
        error.response?.data?.message ||
          "Email không tồn tại hoặc lỗi máy chủ. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (isSuccess) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <Card className="login-card" bordered={false}>
            <Result
              status="success"
              title="Đã gửi Email Đặt lại Mật khẩu!"
              subTitle="Chúng tôi đã gửi một mật khẩu mới đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư."
              extra={[
                <Button
                  type="primary"
                  size="large"
                  onClick={handleBackToLogin}
                  key="login"
                >
                  Quay lại Đăng nhập
                </Button>,
              ]}
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <Title level={2} className="login-title">
              🔐 Quên Mật khẩu
            </Title>
            <Text type="secondary" className="login-subtitle">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mật khẩu mới
            </Text>
          </div>

          <Form
            form={form}
            name="forgot-password"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="login-form"
          >
            <Form.Item
              label="Địa chỉ Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email của bạn!",
                },
                {
                  type: "email",
                  message: "Vui lòng nhập một địa chỉ email hợp lệ!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="input-icon" />}
                placeholder="Nhập email đã đăng ký của bạn"
                size="large"
                className="login-input"
              />
            </Form.Item>

            <Form.Item>
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="login-button"
                  loading={isLoading}
                  block
                >
                  Gửi Mật khẩu Mới
                </Button>

                <Button
                  type="default"
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBackToLogin}
                  block
                >
                  Quay lại Đăng nhập
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <div className="register-section" style={{ marginTop: "20px" }}>
            <Text type="secondary">
              Bạn đã nhớ mật khẩu?{" "}
              <Link onClick={handleBackToLogin} className="register-link">
                Đăng nhập tại đây
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default ForgotPassword;
