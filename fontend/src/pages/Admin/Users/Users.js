import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Tag,
  Select,
  DatePicker,
} from "antd";
import {
  EditOutlined,
  SearchOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import userService from "../../../api/userService/userManagement";
import dayjs from "dayjs";
import "./Users.css";

const { Option } = Select;

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // Load users
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getUsersManagement();
      console.log("📊 Users response:", response);

      // Xử lý response
      const usersData = response.data?.result || response.data || [];

      // Đảm bảo data là array
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.error("Users data is not an array:", usersData);
        setUsers([]);
        message.warning("Định dạng dữ liệu không hợp lệ");
      }
    } catch (error) {
      message.error("Tải danh sách người dùng thất bại");
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Show modal for edit
  const showModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      ...user,
      birthday: user.birthday ? dayjs(user.birthday) : null,
    });
    setIsModalVisible(true);
  };

  // Handle update
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Format data
      const updateData = {
        ...values,
        birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
      };

      await userService.updateUser(editingUser.username, updateData);
      message.success("Cập nhật người dùng thành công");

      setIsModalVisible(false);
      form.resetFields();
      loadUsers();
    } catch (error) {
      if (error.errorFields) {
        return;
      }
      message.error("Cập nhật người dùng thất bại");
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format gender
  const getGenderTag = (gender) => {
    if (gender === 0) {
      return (
        <Tag icon={<WomanOutlined />} color="blue">
          Nữ
        </Tag>
      );
    } else if (gender === 1) {
      return (
        <Tag icon={<ManOutlined />} color="blue">
          Nam
        </Tag>
      );
    } else if (gender === 2) {
      return <Tag color="purple">Khác</Tag>;
    }
    return <Tag>Không rõ</Tag>;
  };

  // Table columns
  const columns = [
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.username &&
        record.username.toLowerCase().includes(value.toLowerCase()),
      render: (text) => <Tag color="blue">{text || "N/A"}</Tag>,
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (gender) => getGenderTag(gender),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
      render: (location) => location || "N/A",
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
    <div className="users-container">
      <div className="users-header">
        <h1>Quản lý Người Dùng</h1>
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên đăng nhập..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(users) ? users : []}
        rowKey={(record) => record.username || Math.random()}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} người dùng`,
        }}
        locale={{
          emptyText: "Không tìm thấy người dùng nào.",
        }}
      />

      <Modal
        title="Chỉnh Sửa Người Dùng"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên!" },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Vui lòng nhập email hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value={1}>
                <ManOutlined /> Nam
              </Option>
              <Option value={0}>
                <WomanOutlined /> Nữ
              </Option>
              <Option value={2}>Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item name="birthday" label="Ngày sinh">
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>

          <Form.Item name="location" label="Vị trí">
            <Input placeholder="Nhập vị trí" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Users;