import React from "react";
import { Button, Card, Row, Col, Typography, Space } from "antd";
import {
  HeartOutlined,
  MessageOutlined,
  SafetyCertificateOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./LandingPage.css";

const { Title, Paragraph } = Typography;

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="hero-section">
          <Title level={1} className="landing-title">
            Tìm Nửa Kia Hoàn Hảo Của Bạn
          </Title>
          <Paragraph className="landing-subtitle">
            Vuốt, Ghép Đôi, Trò Chuyện - Trải nghiệm sự kỳ diệu của hẹn hò hiện đại
          </Paragraph>

          <Row gutter={[16, 24]} className="feature-grid">
            <Col xs={24} sm={24} md={8}>
              <Card className="feature-card" hoverable>
                <div className="feature-content">
                  <HeartOutlined className="feature-icon" />
                  <Title level={3}>Ghép Đôi Thông Minh</Title>
                  <Paragraph>
                    Thuật toán của chúng tôi tìm kiếm những người phù hợp nhất dựa trên sở thích của bạn
                  </Paragraph>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <Card className="feature-card" hoverable>
                <div className="feature-content">
                  <MessageOutlined className="feature-icon" />
                  <Title level={3}>Trò Chuyện Tức Thì</Title>
                  <Paragraph>
                    Bắt đầu trò chuyện với những người tương hợp ngay lập tức
                  </Paragraph>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <Card className="feature-card" hoverable>
                <div className="feature-content">
                  <SafetyCertificateOutlined className="feature-icon" />
                  <Title level={3}>An Toàn & Bảo Mật</Title>
                  <Paragraph>
                    Sự riêng tư và an toàn của bạn luôn là ưu tiên hàng đầu của chúng tôi
                  </Paragraph>
                </div>
              </Card>
            </Col>
          </Row>

          <Space size="large" className="cta-section">
            <Button type="primary" size="large" className="cta-button">
              Bắt Đầu Ngay
            </Button>
            <Button size="large" className="cta-button secondary">
              Tìm Hiểu Thêm
            </Button>
          </Space>
        </div>

        <div className="app-preview">
          <div className="phone-mockup">
            <div className="phone-screen">
              <Card
                className="profile-card"
                cover={<div className="profile-image"></div>}
              >
                <Card.Meta title="Linh, 24" description="Cách 2 km" />
              </Card>
              <Space size="large" className="action-buttons">
                <Button
                  shape="circle"
                  size="large"
                  icon={<CloseOutlined />}
                  className="action-btn reject"
                  danger
                />
                <Button
                  shape="circle"
                  size="large"
                  icon={<HeartOutlined />}
                  className="action-btn like"
                  type="primary"
                />
              </Space>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
