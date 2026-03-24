import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message, Tag } from "antd";
import { PlusOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import interestService from "../../../api/interestService/interestService";
import "./Interests.css";

function Interests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInterest, setEditingInterest] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // Load interests
  const loadInterests = async () => {
    setLoading(true);
    try {
      const response = await interestService.getInterests();
      console.log("📊 Interests response:", response);

      // Xử lý response - có thể là array trực tiếp hoặc trong object
      const interestsData = response.data?.result || response.data || [];

      // Đảm bảo data là array
      if (Array.isArray(interestsData)) {
        setInterests(interestsData);
      } else {
        console.error("Interests data is not an array:", interestsData);
        setInterests([]);
        message.warning("Định dạng dữ liệu không hợp lệ");
      }
    } catch (error) {
      message.error("Tải danh sách sở thích thất bại");
      console.error("Error loading interests:", error);
      setInterests([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterests();
  }, []);

  // Show modal for create/edit
  const showModal = (interest = null) => {
    setEditingInterest(interest);
    if (interest) {
      form.setFieldsValue(interest);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle create/update
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingInterest) {
        // Update
        await interestService.updateInterest(editingInterest.id, values);
        message.success("Cập nhật sở thích thành công");
      } else {
        // Create
        await interestService.createInterest(values);
        message.success("Tạo sở thích thành công");
      }

      setIsModalVisible(false);
      form.resetFields();
      loadInterests();
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        return;
      }
      message.error(
        editingInterest
          ? "Cập nhật sở thích thất bại"
          : "Tạo sở thích thất bại"
      );
      console.error("Error saving interest:", error);
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên sở thích",
      dataIndex: "name",
      key: "name",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name && record.name.toLowerCase().includes(value.toLowerCase()),
      render: (text) => <Tag color="blue">{text || "N/A"}</Tag>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => showModal(record)}
          size="small"
        >
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="interests-container">
      <div className="interests-header">
        <h1>Quản lý Sở Thích</h1>
        <Space>
          <Input
            placeholder="Tìm kiếm sở thích..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            size="large"
          >
            Thêm Sở Thích
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(interests) ? interests : []}
        rowKey={(record) => record.id || record.key || Math.random()}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} sở thích`,
        }}
        locale={{
          emptyText: "Không tìm thấy sở thích nào. Nhấp 'Thêm Sở Thích' để tạo mới.",
        }}
      />

      <Modal
        title={editingInterest ? "Chỉnh Sửa Sở Thích" : "Tạo Sở Thích Mới"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText={editingInterest ? "Cập Nhật" : "Tạo Mới"}
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Sở Thích"
            rules={[
              { required: true, message: "Vui lòng nhập tên sở thích!" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
              { max: 50, message: "Tên không được vượt quá 50 ký tự" },
            ]}
          >
            <Input placeholder="VD: Nhiếp ảnh, Leo núi, Nấu ăn" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {
                max: 200,
                message: "Mô tả không được vượt quá 200 ký tự",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Mô tả ngắn gọn về sở thích này..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Interests;