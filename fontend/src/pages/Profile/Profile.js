import React, { useState, useEffect } from "react";
import {
  Card,
  Avatar,
  Typography,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Row,
  Col,
  Divider,
  Upload,
  Image,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  LeftOutlined,
  CalendarOutlined,
  MailOutlined,
  HomeOutlined,
  BankOutlined,
  HeartOutlined,
  PlusOutlined,
  CameraOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import matchUserService from "../../api/userService/matchUser";
import { getCurrentUserId } from "../../utils/auth";
import moment from "moment";
import { supabase } from "../../config/supabaseClient";
import "./Profile.css";
import imageService from "../../api/userService/images";
import notification from "../../utils/notification";
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [updating, setUpdating] = useState(false);
  const [userPhotos, setUserPhotos] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [newImages, setNewImages] = useState([]); // Theo dõi ảnh mới để upload
  const [deletedImages, setDeletedImages] = useState([]); // Theo dõi URL ảnh bị xóa
  const [hasImageChanges, setHasImageChanges] = useState(false);
  // Trạng thái modal đổi mật khẩu
  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm] = Form.useForm();

  // Tải ảnh lên Supabase
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

  // Mở modal đổi mật khẩu
  const openChangePasswordModal = () => {
    passwordForm.resetFields();
    setChangePasswordModalVisible(true);
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      const { currentPassword, newPassword, confirmPassword } = values;

      if (newPassword !== confirmPassword) {
        message.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
      }

      if (!newPassword || newPassword.length < 6) {
        message.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
        return;
      }

      setChangingPassword(true);
      console.log("🔐 Đang đổi mật khẩu...");

      const payload = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };

      const resp = await matchUserService.updatePassword(payload);
      console.log("✅ Phản hồi đổi mật khẩu:", resp);

      const code = resp?.data?.code ?? resp?.status;
      const serverMessage =
        resp?.data?.message || resp?.data?.msg || resp?.statusText;
      if (code === 200) {
        setChangePasswordModalVisible(false);
        passwordForm.resetFields();
        notification.success("Đổi mật khẩu thành công!");
      } else {
        notification.error(resp.data?.message || serverMessage);
      }
    } catch (error) {
      console.error("❌ Lỗi đổi mật khẩu:", error);
      notification.error(
        error?.response?.data?.message ||
          error?.message ||
          "Đổi mật khẩu thất bại"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // Tải dữ liệu hồ sơ người dùng
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      console.log("🔍 Đang tải hồ sơ cho ID người dùng:", userId);

      if (!userId) {
        console.error("❌ Không tìm thấy ID người dùng");
        navigate("/login");
        return;
      }

      const response = await matchUserService.getUserProfile();
      
      let profileData = null;
      if (response?.data?.result) {
        profileData = response.data.result;
      } else if (response?.result) {
        profileData = response.result;
      } else if (response?.data) {
        profileData = response.data;
      } else if (response) {
        profileData = response;
      }

      // Tải ảnh người dùng
      if (profileData?.images) {
        const validImages = profileData.images
          .filter((imgUrl) => {
            return imgUrl != null && imgUrl !== "" && typeof imgUrl === "string";
          })
          .map((imageUrl, index) => ({
            id: `existing_${index}`,
            imageUrl: imageUrl,
            isNew: false,
          }));
        setUserPhotos(validImages);
      }

      if (profileData) {
        setUserProfile(profileData);

        const birthDayValue =
          profileData.birthday || profileData.birthDay || profileData.birth_day;

        const formData = {
          fullName: profileData.fullName || profileData.full_name || "",
          email: profileData.email || "",
          gender: profileData.gender || "",
          birthDay: birthDayValue ? moment(birthDayValue, "YYYY-MM-DD") : null,
          tall: profileData.tall || profileData.height || "",
          school: profileData.school || "",
          company: profileData.company || "",
          bio: profileData.bio || profileData.description || "",
          username: profileData.username || "",
        };

        form.setFieldsValue(formData);
      }
    } catch (error) {
      console.error("❌ Lỗi tải hồ sơ:", error);

      if (error?.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn!");
        navigate("/login");
      } else if (error?.response?.status === 404) {
        message.error("Không tìm thấy thông tin người dùng!");
      } else {
        message.error("Không thể tải thông tin người dùng!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật hồ sơ
  const handleUpdateProfile = async (values) => {
    try {
      setUpdating(true);
      
      const apiPayload = {
        fullName: values.fullName || "",
        email: values.email || "",
        gender: values.gender || "",
        birthDay: values.birthDay ? values.birthDay.format("YYYY-MM-DD") : null,
        tall: values.tall ? parseInt(values.tall) : null,
        school: values.school || "",
        company: values.company || "",
        bio: values.bio || "",
      };

      // Loại bỏ các giá trị null/trống
      Object.keys(apiPayload).forEach((key) => {
        if (apiPayload[key] === null || apiPayload[key] === "") {
          delete apiPayload[key];
        }
      });

      const response = await matchUserService.updateUserProfile(apiPayload);

      if (response?.data || response?.status === 200 || response) {
        message.success("Cập nhật hồ sơ thành công!");
        setEditModalVisible(false);
        await loadUserProfile();
      } else {
        message.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật hồ sơ:", error);

      if (error?.response?.status === 400) {
        message.error("Dữ liệu không hợp lệ!");
      } else if (error?.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn!");
        navigate("/login");
      } else {
        message.error("Lỗi khi cập nhật thông tin!");
      }
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Tính tuổi từ ngày sinh
  const calculateAge = (birthDay) => {
    if (!birthDay) return null;
    return moment().diff(moment(birthDay), "years");
  };

  // Định dạng hiển thị giới tính
  const formatGender = (gender) => {
    const genderMap = {
      1: "Nam",
      0: "Nữ",
      2: "Khác",
    };
    return genderMap[gender] || "Không xác định";
  };

  // Xử lý thêm ảnh
  const handlePhotoUpload = async (file) => {
    try {
      if (userPhotos.length >= 6) {
        message.error("Bạn chỉ có thể tải lên tối đa 6 ảnh!");
        return false;
      }

      const isValidImage =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isValidImage) {
        message.error("Chỉ cho phép tệp JPG/PNG!");
        return false;
      }

      const previewUrl = URL.createObjectURL(file);
      const tempId = `temp_${Date.now()}`;

      const newPhoto = {
        id: tempId,
        imageUrl: previewUrl,
        isNew: true,
        file: file,
      };

      setUserPhotos((prev) => [...prev, newPhoto]);

      setNewImages((prev) => [
        ...prev,
        {
          imageUrl: previewUrl,
          file: file,
          tempId: tempId,
        },
      ]);

      setHasImageChanges(true);
      message.success("Đã thêm ảnh! Nhấn 'Lưu thay đổi' để tải lên.");
    } catch (error) {
      console.error("❌ Lỗi thêm ảnh:", error);
      message.error("Lỗi khi thêm ảnh!");
    }

    return false;
  };

  // Xử lý xóa ảnh
  const handleDeletePhoto = (photoId) => {
    const photoToDelete = userPhotos.find((photo) => photo.id === photoId);

    if (photoToDelete) {
      setUserPhotos((prev) => prev.filter((photo) => photo.id !== photoId));

      if (photoToDelete.isNew) {
        setNewImages((prev) => prev.filter((img) => img.tempId !== photoId));
      } else {
        const photoUrl = photoToDelete.imageUrl;
        setDeletedImages((prev) => [...prev, photoUrl]);
      }

      setHasImageChanges(true);
      message.success("Đã xóa ảnh! Nhấn 'Lưu thay đổi' để xác nhận.");
    }
  };

  // Lưu thay đổi ảnh lên máy chủ
  const handleSaveImageChanges = async () => {
    if (!hasImageChanges) {
      message.info("Không có thay đổi ảnh nào để lưu!");
      return;
    }

    setUploadingPhoto(true);
    try {
      let newImageUrls = [];
      if (newImages.length > 0) {
        const uploadPromises = newImages.map((imgObj) =>
          uploadToSupabase(imgObj.file)
        );
        const uploadResults = await Promise.all(uploadPromises);
        newImageUrls = uploadResults.map((result) => result.url);
      }

      const imageUpdatePayload = {
        newImages: newImageUrls,
        deletedImages: deletedImages,
      };

      const response = await imageService.updateUserImages(imageUpdatePayload);

      if (response) {
        message.success("Cập nhật ảnh thành công!");
        setNewImages([]);
        setDeletedImages([]);
        setHasImageChanges(false);
        await loadUserProfile();
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật ảnh:", error);
      message.error("Lỗi khi cập nhật ảnh! " + error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Lấy URL ảnh đại diện
  const getAvatarUrl = () => {
    if (userPhotos.length > 0) {
      return userPhotos[0].imageUrl;
    }
    return userProfile?.images?.[0] || null;
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <Spin size="large" />
        <p>Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="profile-error">
        <Title level={4}>Không thể tải thông tin người dùng</Title>
        <Button onClick={() => navigate("/match")}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => navigate("/match")}
          className="profile-back-btn"
        >
          Quay lại
        </Button>
        <Typography.Title level={4} className="profile-title">
          Hồ sơ của tôi
        </Typography.Title>
        <Button
          style={{ marginLeft: 8 }}
          type="primary"
          icon={<EditOutlined />}
          onClick={openChangePasswordModal}
          className="profile-edit-btn"
        >
          Đổi mật khẩu
        </Button>
      </div>

      {/* Nội dung chính */}
      <div className="profile-content">
        <Row gutter={24}>
          {/* Cột trái - Ảnh đại diện & Thông tin cơ bản */}
          <Col xs={24} md={10}>
            <Card className="profile-main-card">
              <div className="profile-avatar-section">
                <Avatar
                  size={120}
                  src={getAvatarUrl()}
                  icon={<UserOutlined />}
                  className="profile-avatar"
                />
                <Typography.Title level={3} className="profile-name">
                  {userProfile.fullName || userProfile.username || "Tên người dùng"}
                </Typography.Title>
                <Typography.Text className="profile-username">
                  @{userProfile.username || "username"}
                </Typography.Text>
                {(userProfile.birthday || userProfile.birthDay || userProfile.birth_day) && (
                  <div className="profile-age">
                    {calculateAge(userProfile.birthday || userProfile.birthDay || userProfile.birth_day)} tuổi
                  </div>
                )}
              </div>

              <Divider />

              {/* Thông tin nhanh */}
              <div className="quick-info">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="info-box">
                      <div className="info-number">
                        {userProfile.tall || userProfile.height || "?"}
                      </div>
                      <div className="info-label">Chiều cao (cm)</div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="info-box">
                      <div className="info-number">
                        {formatGender(userProfile.gender) || "?"}
                      </div>
                      <div className="info-label">Giới tính</div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Divider />

              {/* Thư viện ảnh */}
              <div className="photo-gallery">
                <div className="gallery-header">
                  <Typography.Text strong>Ảnh của tôi</Typography.Text>
                  <Typography.Text className="gallery-count">
                    ({userPhotos.length}/6)
                  </Typography.Text>
                </div>

                <div className="photo-grid">
                  {userPhotos
                    .filter((photo) => photo && photo.imageUrl)
                    .map((photo, index) => (
                      <div key={photo.id || index} className="photo-item">
                        <div className="photo-wrapper">
                          <Image
                            src={photo.imageUrl}
                            alt={`Ảnh ${index + 1}`}
                            className="photo-thumbnail"
                            preview={true}
                          />
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeletePhoto(photo.id)}
                            className="delete-photo-btn"
                          />
                          {photo.isNew && (
                            <div className="new-photo-badge">Mới</div>
                          )}
                        </div>
                        {index === 0 && (
                          <div className="main-photo-badge">Ảnh chính</div>
                        )}
                      </div>
                    ))}

                  {userPhotos.length < 6 && (
                    <Upload
                      beforeUpload={handlePhotoUpload}
                      showUploadList={false}
                      accept="image/*"
                      className="photo-upload"
                    >
                      <div className="upload-placeholder">
                        <PlusOutlined />
                        <div>Thêm ảnh</div>
                      </div>
                    </Upload>
                  )}
                </div>

                {/* Nút lưu thay đổi ảnh */}
                {hasImageChanges && (
                  <div className="save-images-section">
                    <Button
                      type="primary"
                      icon={<CameraOutlined />}
                      onClick={handleSaveImageChanges}
                      loading={uploadingPhoto}
                      className="save-images-btn"
                    >
                      {uploadingPhoto
                        ? "Đang lưu ảnh..."
                        : "Lưu thay đổi ảnh"}
                    </Button>
                    <Typography.Text type="secondary" className="save-hint">
                      Bạn có thay đổi ảnh chưa lưu
                    </Typography.Text>
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* Cột phải - Thông tin chi tiết */}
          <Col xs={24} md={14}>
            <Card className="profile-details-card" title="Thông tin chi tiết">
              <div className="details-grid">
                <div className="detail-item">
                  <MailOutlined className="detail-icon" />
                  <div>
                    <div className="detail-label">Email</div>
                    <div className="detail-value">
                      {userProfile.email || "Chưa cập nhật"}
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <CalendarOutlined className="detail-icon" />
                  <div>
                    <div className="detail-label">Ngày sinh</div>
                    <div className="detail-value">
                      {userProfile.birthday || userProfile.birthDay || userProfile.birth_day
                        ? moment(userProfile.birthday || userProfile.birthDay || userProfile.birth_day).format("DD/MM/YYYY")
                        : "Chưa cập nhật"}
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <HomeOutlined className="detail-icon" />
                  <div>
                    <div className="detail-label">Trường học</div>
                    <div className="detail-value">
                      {userProfile.school || "Chưa cập nhật"}
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <BankOutlined className="detail-icon" />
                  <div>
                    <div className="detail-label">Công ty</div>
                    <div className="detail-value">
                      {userProfile.company || "Chưa cập nhật"}
                    </div>
                  </div>
                </div>

                <div className="detail-item bio-item">
                  <HeartOutlined className="detail-icon" />
                  <div>
                    <div className="detail-label">Giới thiệu bản thân</div>
                    <div className="detail-value bio-text">
                      {userProfile.bio ||
                        userProfile.description ||
                        "Chưa có thông tin giới thiệu..."}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", marginTop: 16 }}>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditModalVisible(true)}
                  className="profile-edit-btn"
                >
                  Chỉnh sửa
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal chỉnh sửa hồ sơ */}
      <Modal
        title="Chỉnh sửa hồ sơ"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
        className="edit-profile-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          className="edit-profile-form"
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[
              { required: true, message: "Vui lòng nhập họ và tên!" },
            ]}
          >
            <Input placeholder="Nhập họ và tên của bạn" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value={1}>Nam</Option>
              <Option value={0}>Nữ</Option>
              <Option value={2}>Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Ngày sinh" name="birthDay">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item label="Chiều cao (cm)" name="tall">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập chiều cao"
              min={140}
              max={220}
            />
          </Form.Item>

          <Form.Item label="Trường học" name="school">
            <Input placeholder="Nhập tên trường học" />
          </Form.Item>

          <Form.Item label="Công ty" name="company">
            <Input placeholder="Nhập tên công ty" />
          </Form.Item>

          <Form.Item label="Giới thiệu bản thân" name="bio">
            <TextArea
              rows={4}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              maxLength={500}
            />
          </Form.Item>

          <div className="modal-actions">
            <Button onClick={() => setEditModalVisible(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" loading={updating}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        open={changePasswordModalVisible}
        onCancel={() => setChangePasswordModalVisible(false)}
        footer={null}
        width={520}
        className="change-password-modal"
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          className="change-password-form"
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
          >
            <Input.Password placeholder="Mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password placeholder="Mật khẩu mới (tối thiểu 6 ký tự)" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <div className="modal-actions">
            <Button onClick={() => setChangePasswordModalVisible(false)}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              onClick={() => passwordForm.submit()}
              loading={changingPassword}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
