import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Spin, message } from "antd";
import {
  UserOutlined,
  HeartOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import dashboardService from "../../../api/dashboardService/dashboardService";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUserCount: 0,
    totalMatchesCount: 0,
    totalMessageCount: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load dashboard statistics
  const loadDashboardInfo = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getDashboardInfo();
      console.log("📊 Dashboard response:", response);

      const dashboardData = response.data?.result || response.data || {};

      setStats({
        totalUserCount: dashboardData.totalUserCount || 0,
        totalMatchesCount: dashboardData.totalMatchesCount || 0,
        totalMessageCount: dashboardData.totalMessageCount || 0,
      });
    } catch (error) {
      message.error("Không thể tải số liệu thống kê bảng điều khiển");
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardInfo();
  }, []);

  if (loading) {
    return (
      <div
        className="dashboard-container"
        style={{ textAlign: "center", padding: "100px 0" }}
      >
        <Spin size="large" />
        <p style={{ marginTop: 20 }}>Đang tải bảng điều khiển...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Bảng điều khiển quản trị</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats.totalUserCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng số lượt ghép đôi"
              value={stats.totalMatchesCount}
              prefix={<HeartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng số tin nhắn"
              value={stats.totalMessageCount}
              prefix={<MessageOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <h2>Chào mừng đến với Bảng điều khiển quản trị Tinder</h2>
        <p>
          Quản lý ứng dụng của bạn từ đây. Sử dụng thanh bên để điều hướng giữa
          các phần khác nhau.
        </p>
        <div style={{ marginTop: 20 }}>
          <p>
            <strong>Thống kê nhanh:</strong>
          </p>
          <ul>
            <li>👥 {stats.totalUserCount} người dùng đã đăng ký</li>
            <li>💕 {stats.totalMatchesCount} lượt ghép đôi thành công</li>
            <li>💬 {stats.totalMessageCount} tin nhắn đã trao đổi</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
