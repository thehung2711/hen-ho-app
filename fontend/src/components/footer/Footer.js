import React from "react";
import { Layout, Button, Space, Typography, Row, Col } from "antd";
import {
  LoginOutlined,
  HeartOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link } = Typography;

function Footer() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <AntFooter className="footer">
      <div className="footer-content">
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={4} className="footer-title">
                💕 TinderApp
              </Title>
              <Text className="footer-description">
                Tìm nửa kia hoàn hảo với thuật toán ghép đôi thông minh.
                Trải nghiệm sự kỳ diệu của hẹn hò hiện đại.
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-section-title">
                Liên Kết Nhanh
              </Title>
              <div className="footer-links">
                <Link href="#" className="footer-link">
                  Về Chúng Tôi
                </Link>
                <Link href="#" className="footer-link">
                  Cách Hoạt Động
                </Link>
                <Link href="#" className="footer-link">
                  Mẹo An Toàn
                </Link>
                <Link href="#" className="footer-link">
                  Câu Chuyện Thành Công
                </Link>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-section-title">
                Hỗ Trợ
              </Title>
              <div className="footer-links">
                <Link href="#" className="footer-link">
                  Trung Tâm Trợ Giúp
                </Link>
                <Link href="#" className="footer-link">
                  Liên Hệ
                </Link>
                <Link href="#" className="footer-link">
                  Chính Sách Bảo Mật
                </Link>
                <Link href="#" className="footer-link">
                  Điều Khoản Dịch Vụ
                </Link>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <div className="footer-section">
              <Title level={5} className="footer-section-title">
                Bắt Đầu
              </Title>
              <Text className="footer-description">
                Sẵn sàng tìm nửa kia?
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={handleLoginClick}
                className="footer-login-btn"
              >
                Đăng Nhập Ngay
              </Button>
            </div>
          </Col>
        </Row>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <Row justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Text className="footer-copyright">
                © 2026 TinderApp. Đã đăng ký bản quyền.
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <Space size="large" className="footer-contact">
                <Space>
                  <PhoneOutlined className="footer-contact-icon" />
                  <Text className="footer-contact-text">+1 (555) 123-4567</Text>
                </Space>
                <Space>
                  <MailOutlined className="footer-contact-icon" />
                  <Text className="footer-contact-text">
                    hello@tinderapp.com
                  </Text>
                </Space>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
    </AntFooter>
  );
}

export default Footer;
