package com.tinder.tinder.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInforUser {
    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Kinh độ không được để trống")
    private String addressLon;

    @NotBlank(message = "Vĩ độ không được để trống")
    private String addressLat;

    @NotNull(message = "Giới tính là bắt buộc")
    @Min(value = 0, message = "Giới tính phải là Nam hoặc Nữ hoặc Khác")
    @Max(value = 2, message = "Giới tính phải là Nam hoặc Nữ hoặc Khác")
    private Integer gender;

    @NotNull(message = "Đối tượng quan tâm là bắt buộc")
    @Min(value = 0, message = "Đối tượng quan tâm phải là Nam hoặc Nữ hoặc Cả 2")
    @Max(value = 2, message = "Đối tượng quan tâm phải là Nam hoặc Nữ hoặc Cả 2")
    private Integer interestedIn;

    @NotNull(message = "Ngày sinh là bắt buộc")
    @Past(message = "Ngày sinh phải ở trong quá khứ")
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate birthday;

    @Size(min = 1, max = 6, message = "Bạn phải upload từ 1 đến 6 ảnh")
    private List<String> images;

    @Size(min = 1, max = 5, message = "Bạn phải chọn từ 1 đến 5 sở thích")
    private List<Long> interestIds;

    private String school;

    @Min(value = 0, message = "Chiều cao phải lớn hon 0")
    private Double tall;

    private String company;

    @NotBlank(message = "Bio không được để trống")

    private String bio;

}
