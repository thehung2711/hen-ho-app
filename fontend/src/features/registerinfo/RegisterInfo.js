import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Select,
  DatePicker,
  Upload,
  Space,
  Row,
  Col,
  message,
  Modal,
  Checkbox,
  Tag,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  CameraOutlined,
  PlusOutlined,
  HeartOutlined,
  LoadingOutlined,
  EditOutlined,
  HomeOutlined,
  BookOutlined,
  LineHeightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { supabase } from "../../config/supabaseClient";
import {
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
} from "../../utils/notification";
import "./RegisterInfo.css";
import authService from "../../api/authService";
import interestService from "../../api/interestService/interestService";

const { Title, Text } = Typography;
const { Option } = Select;

function RegisterInfo() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imageList, setImageList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [interestsModalVisible, setInterestsModalVisible] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [tempSelectedInterests, setTempSelectedInterests] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [availableInterests, setAvailableInterests] = useState([]);

  useEffect(() => {
    // Fetch interests from backend API
    const fetchInterests = async () => {
      try {
        const response = await interestService.getInterests();
        if (response && response.data) {
          setAvailableInterests(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching interests:", error);
        setAvailableInterests([]);
      }
    };
    fetchInterests();
  }, []);

  const handleInterestsClick = () => {
    setTempSelectedInterests([...selectedInterests]);
    setInterestsModalVisible(true);
  };

  const handleInterestChange = (interest) => {
    const isSelected = tempSelectedInterests.some(
      (item) => item.id === interest.id
    );
    const newInterests = isSelected
      ? tempSelectedInterests.filter((item) => item.id !== interest.id)
      : [...tempSelectedInterests, interest];

    if (newInterests.length <= 5) {
      setTempSelectedInterests(newInterests);
    } else {
      message.warning("Bạn chỉ có thể chọn tối đa 5 sở thích!");
    }
  };

  const handleSaveInterests = () => {
    setSelectedInterests([...tempSelectedInterests]);
    setInterestsModalVisible(false);
    const interestIds = tempSelectedInterests.map((interest) => interest.id);
    form.setFieldsValue({ interests: interestIds });
    message.success(`Đã lưu ${tempSelectedInterests.length} sở thích!`);
  };

  const handleCancelInterests = () => {
    setTempSelectedInterests([...selectedInterests]);
    setInterestsModalVisible(false);
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Preview ảnh
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // Upload ảnh lên Supabase
  const uploadToSupabase = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Lấy public URL
      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error("Không thể lấy public URL");
      }

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } catch (error) {
      console.error("Lỗi upload:", error);
      throw error;
    }
  };

  const handleImageChange = async ({ fileList: newFileList }) => {
    // Chỉ cập nhật preview, chưa upload
    const updatedList = await Promise.all(
      newFileList.map(async (file) => {
        if (!file.url && !file.preview && file.originFileObj) {
          file.preview = await getBase64(file.originFileObj);
        }
        return file;
      })
    );
    setImageList(updatedList);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
      return Upload.LIST_IGNORE;
    }

    if (imageList.length >= 6) {
      message.error("Bạn có thể tải lên tối đa 6 ảnh!");
      return Upload.LIST_IGNORE;
    }

    return false; // Không auto upload
  };

  const onFinish = async (values) => {
    if (imageList.length === 0) {
      showWarningNotification(
        "Bắt buộc có ảnh",
        "Vui lòng tải lên ít nhất 1 bức ảnh!"
      );
      return;
    }

    try {
      setUploading(true);

      // 1️⃣ Upload tất cả ảnh lên Supabase
      const uploadPromises = imageList.map((file) =>
        uploadToSupabase(file.originFileObj)
      );
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.url);

      // 2️⃣ Hàm lấy vị trí (Promise wrapper)
      const getLocation = () => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => {
              console.warn("⚠️ Không lấy được vị trí:", err.message);
              // fallback về 0.0 nếu bị từ chối
              resolve({ latitude: 0.0, longitude: 0.0 });
            }
          );
        });
      };

      // 3️⃣ Chờ lấy vị trí xong rồi mới format dữ liệu
      const coords = await getLocation();

      const formattedValues = {
        fullName: values.fullName,
        email: values.email,
        addressLon: coords.longitude,
        addressLat: coords.latitude,
        gender: Number(values.gender),
        interestedIn: Number(values.interestedIn),
        birthday: values.birthday
          ? dayjs(values.birthday).format("DD/MM/YYYY")
          : null,
        bio: values.bio || "",
        company: values.company || "",
        school: values.school || "",
        tall: values.tall ? Number(values.tall) : null,
        interestIds: selectedInterests.map((interest) => interest.id),
        images: imageUrls,
      };

      console.log("📍 Vị trí:", coords.longitude, coords.latitude);
      console.log("📤 Đang gửi thông tin lên backend:", formattedValues);

      // 4️⃣ Gọi API POST /create-infor-user
      const response = await authService.create_user_info(formattedValues);

      showSuccessNotification(
        "Tạo Hồ Sơ Thành Công!",
        response.data.message || "Hồ sơ của bạn đã được tạo. Chào mừng!"
      );
      console.log("✅ Phản hồi từ backend:", response.data);

      // 5️⃣ Điều hướng sau khi thành công
      navigate("/match");
    } catch (error) {
      showErrorNotification(
        "Tạo Hồ Sơ Thất Bại",
        error.response?.data?.message ||
          error.message ||
          "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Tạo hồ sơ thất bại:", errorInfo);
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {imageList.length === 0
          ? "Tải Ảnh Lên"
          : `Thêm Ảnh (${imageList.length}/6)`}
      </div>
    </div>
  );

  return (
    <div className="register-info-container">
      <div className="register-info-wrapper">
        <Card className="register-info-card" bordered={false}>
          <div className="register-info-header">
            <Title level={2} className="register-info-title">
              💕 Hoàn Thiện Hồ Sơ
            </Title>
            <Text type="secondary" className="register-info-subtitle">
              Chia sẻ về bản thân để tìm được những người phù hợp hơn
            </Text>
          </div>

          <Form
            form={form}
            name="registerInfo"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="register-info-form"
          >
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Họ và Tên"
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ và tên!",
                    },
                    {
                      min: 2,
                      message: "Họ và tên phải có ít nhất 2 ký tự!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="input-icon" />}
                    placeholder="Nhập họ và tên"
                    size="large"
                    className="register-info-input"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                    },
                    {
                      type: "email",
                      message: "Vui lòng nhập email hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="input-icon" />}
                    placeholder="Nhập email"
                    size="large"
                    className="register-info-input"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Giới tính"
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn giới tính!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn giới tính"
                    size="large"
                    className="register-info-select"
                  >
                    <Option value="1">Nam</Option>
                    <Option value="2">Nữ</Option>
                    <Option value="0">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Quan tâm đến"
                  name="interestedIn"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng chọn giới tính bạn quan tâm!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Quan tâm đến"
                    size="large"
                    className="register-info-select"
                  >
                    <Option value="1">Nam</Option>
                    <Option value="2">Nữ</Option>
                    <Option value="0">Cả hai</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Ngày sinh"
                  name="birthday"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn ngày sinh!",
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn ngày sinh"
                    size="large"
                    className="register-info-datepicker"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    suffixIcon={<CalendarOutlined className="input-icon" />}
                    disabledDate={(current) => {
                      return (
                        current &&
                        (current > dayjs().endOf("day") ||
                          current < dayjs().subtract(100, "year"))
                      );
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Giới thiệu bản thân (Bio)"
              name="bio"
              rules={[
                {
                  max: 500,
                  message: "Bio phải ít hơn 500 ký tự!",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Giới thiệu đôi chút về bản thân..."
                size="large"
                className="register-info-input"
                rows={3}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={8} md={8}>
                <Form.Item
                  label="Chiều cao (cm)"
                  name="tall"
                  rules={[
                    {
                      pattern: /^[0-9]+$/,
                      message: "Vui lòng nhập chiều cao hợp lệ bằng cm!",
                    },
                    {
                      validator: (_, value) => {
                        if (value && (value < 100 || value > 250)) {
                          return Promise.reject(
                            new Error("Chiều cao phải từ 100-250 cm!")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    prefix={<LineHeightOutlined className="input-icon" />}
                    placeholder="VD: 170"
                    size="large"
                    className="register-info-input"
                    suffix="cm"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8} md={8}>
                <Form.Item
                  label="Công ty / Nơi làm việc"
                  name="company"
                  rules={[
                    {
                      max: 100,
                      message: "Tên công ty phải ít hơn 100 ký tự!",
                    },
                  ]}
                >
                  <Input
                    prefix={<HomeOutlined className="input-icon" />}
                    placeholder="Bạn làm việc ở đâu?"
                    size="large"
                    className="register-info-input"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8} md={8}>
                <Form.Item
                  label="Trường học"
                  name="school"
                  rules={[
                    {
                      max: 100,
                      message: "Tên trường học phải ít hơn 100 ký tự!",
                    },
                  ]}
                >
                  <Input
                    prefix={<BookOutlined className="input-icon" />}
                    placeholder="Bạn học ở đâu?"
                    size="large"
                    className="register-info-input"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Sở thích (Chọn tối đa 5)"
              name="interests"
              rules={[
                {
                  validator: (_, value) => {
                    if (selectedInterests.length === 0) {
                      return Promise.reject(
                        new Error("Vui lòng chọn ít nhất một sở thích!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <div className="interests-field" onClick={handleInterestsClick}>
                <div className="interests-display">
                  <HeartOutlined
                    className="input-icon"
                    style={{ marginRight: 8 }}
                  />
                  {Array.isArray(selectedInterests) &&
                  selectedInterests.length > 0 ? (
                    <div className="selected-interests">
                      {selectedInterests.map((interest) => (
                        <Tag
                          key={interest.id}
                          color="#1890ff"
                          className="interest-tag"
                        >
                          {interest.name}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <Text type="secondary">Nhấp để chọn sở thích của bạn</Text>
                  )}
                </div>
              </div>
            </Form.Item>

            <Form.Item
              label="Ảnh hồ sơ (1-6 ảnh)"
              name="images"
              rules={[
                {
                  validator: (_, value) => {
                    if (imageList.length === 0) {
                      return Promise.reject(
                        new Error("Vui lòng tải lên ít nhất một bức ảnh!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <div className="upload-section">
                <Upload
                  name="photos"
                  listType="picture-card"
                  className="avatar-uploader"
                  fileList={imageList}
                  beforeUpload={beforeUpload}
                  onChange={handleImageChange}
                  onPreview={handlePreview}
                  accept="image/jpeg,image/jpg,image/png"
                  multiple
                  maxCount={6}
                >
                  {imageList.length >= 6 ? null : uploadButton}
                </Upload>
                <div className="upload-hint">
                  <Text type="secondary">
                    Tải lên 1-6 bức ảnh rõ nét của bạn. Định dạng JPG hoặc PNG.
                    <br />
                    Ảnh đầu tiên sẽ là ảnh đại diện chính của bạn.
                  </Text>
                </div>
              </div>
            </Form.Item>

            <Form.Item className="form-actions">
              <Space
                size="large"
                direction="vertical"
                style={{ width: "100%" }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="complete-profile-button"
                  block
                  loading={uploading}
                  disabled={uploading}
                >
                  {uploading ? "Đang tạo hồ sơ..." : "Hoàn Thành Hồ Sơ"}
                </Button>
                <Button
                  type="text"
                  size="large"
                  onClick={() => navigate(-1)}
                  className="back-button"
                  block
                  disabled={uploading}
                >
                  Quay lại
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* Interests Selection Modal */}
      <Modal
        title="Chọn Sở Thích Của Bạn"
        open={interestsModalVisible}
        onOk={handleSaveInterests}
        onCancel={handleCancelInterests}
        okText="Lưu Sở Thích"
        cancelText="Hủy"
        width={600}
        className="interests-modal"
        okButtonProps={{
          disabled: tempSelectedInterests.length === 0,
          className: "interests-save-btn",
        }}
      >
        <div className="interests-modal-content">
          <Text type="secondary" className="interests-instruction">
            Chọn tối đa 5 sở thích mô tả đúng nhất về bạn (
            {tempSelectedInterests.length}/5 đã chọn)
          </Text>

          <div className="interests-grid">
            {Array.isArray(availableInterests) &&
              availableInterests.map((interest) => (
                <div
                  key={interest.id}
                  className={`interest-item ${
                    tempSelectedInterests.some(
                      (item) => item.id === interest.id
                    )
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleInterestChange(interest)}
                >
                  <Checkbox
                    checked={tempSelectedInterests.some(
                      (item) => item.id === interest.id
                    )}
                    onChange={() => handleInterestChange(interest)}
                  >
                    {interest.name}
                  </Checkbox>
                </div>
              ))}
          </div>
        </div>
      </Modal>

      {/* Preview Image Modal */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}

export default RegisterInfo;
