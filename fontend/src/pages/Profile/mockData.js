// Mock API response cho testing Profile page
// Có thể sử dụng trong development nếu backend chưa sẵn sằng

export const mockProfileData = {
  code: 200,
  message: "Success",
  result: {
    id: 1,
    username: "john_doe",
    fullName: "Nguyễn Văn Nam",
    email: "john.doe@example.com",
    gender: "MALE",
    birthDay: "1995-05-15",
    school: "Đại học Bách Khoa Hà Nội",
    tall: 175,
    company: "FPT Software",
    bio: "Tôi là một lập trình viên đam mê công nghệ, thích đi du lịch và khám phá những điều mới mẻ. Tôi luôn tìm kiếm những người bạn có chung sở thích và có thể cùng nhau phát triển.",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    location: "Hà Nội, Việt Nam",
    interests: ["Công nghệ", "Du lịch", "Âm nhạc", "Thể thao"],
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    ],
  },
};

export const mockUpdateResponse = {
  code: 200,
  message: "Profile updated successfully",
  result: true,
};
