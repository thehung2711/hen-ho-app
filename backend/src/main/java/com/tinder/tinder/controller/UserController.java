package com.tinder.tinder.controller;

import com.tinder.tinder.dto.request.*;
import com.tinder.tinder.dto.response.*;
import com.tinder.tinder.jwt.JwtUtil;
import com.tinder.tinder.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }
//    @GetMapping("/me")
//    public ApiResponse<AccountResponse> infor(HttpServletRequest request) {
//        ApiResponse apiResponse = new ApiResponse();
//        String authHeader = request.getHeader("Authorization");
//        if(authHeader != null && authHeader.startsWith("Bearer ")) {
//            String token = authHeader.substring(7);
//            Long userId = jwtUtil.getUserIdFromToken(token);
//            AccountResponse accountResponse = userService.getAccountInfor(userId);
//            if(accountResponse != null) {
//                apiResponse.setCode(200);
//                apiResponse.setMessage("Ok");
//                apiResponse.setResult(accountResponse);
//            }
//        }
//        return apiResponse;
//    }
//    @GetMapping("/get-id")
//    public ResponseEntity<?> getUserId(@RequestHeader("Authorization") String authHeader) {
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(Map.of("code", 401, "message", "Token không hợp lệ hoặc thiếu"));
//        }
//        try {
//            String token = authHeader.substring(7);
//            System.out.println(token);
//            Long userId = jwtUtil.getUserIdFromToken(token);
//            System.out.println(userId);
//            return ResponseEntity.ok(Map.of("userId", userId));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(Map.of("code", 401, "message", "Token không hợp lệ hoặc đã hết hạn"));
//        }
//    }
    @PutMapping("create-infor-user")
    public ApiResponse<String> createUser(@RequestBody @Valid CreateInforUser inforUser) {
        ApiResponse apiResponse = new ApiResponse();
        userService.updateInforUser(inforUser);
        apiResponse.setMessage("Tạo thông tin người dùng thành công");
        apiResponse.setCode(200);
        apiResponse.setResult("");
        return apiResponse;
    }
    @PutMapping("update-address")
    public ApiResponse<String> updateAddress(@RequestParam String lon, String lat) {
        ApiResponse apiResponse = new ApiResponse();
        userService.updateAddressUser(lat, lon);
        apiResponse.setMessage("Cập nhật vị trí của người dùng thành công");
        apiResponse.setCode(200);
        apiResponse.setResult("");
        return apiResponse;
    }

    @PutMapping("update-password")
    public ApiResponse<String> updatePassword(@RequestBody ChangePassRequest request) {
        ApiResponse apiResponse = new ApiResponse();
        userService.changePassword(request.getOldPassword(), request.getNewPassword());
        apiResponse.setMessage("Đổi mật khẩu thành công");
        apiResponse.setCode(200);
        apiResponse.setResult("");
        return apiResponse;
    }

    @GetMapping("check-user")
    public ApiResponse<Boolean> checkUser() {
        ApiResponse response = new ApiResponse<>();
        Boolean result = userService.checkUser();
        response.setCode(200);
        response.setResult(result);
        return response;
    }

    @PutMapping("/update-user")
    public ApiResponse<String> updateUser(@RequestBody @Valid UserUpdate request) {
        ApiResponse<String> apiResponse = new ApiResponse<>();
        userService.updateUser(request);
        apiResponse.setCode(200);
        apiResponse.setResult("");
        apiResponse.setMessage("Update user success");
        return apiResponse;
    }

    @GetMapping("/get-user-suitable")
    public ApiResponse<List<UserMatchResult>> getUserNearBy() {

        ApiResponse<List<UserMatchResult>> apiResponse = new ApiResponse<>();
        List<UserMatchResult> results = userService.findMatches();

        if (results == null || results.isEmpty()) {
            apiResponse.setCode(HttpStatus.NO_CONTENT.value());
            apiResponse.setMessage("Không có người dùng phù hợp với bạn, vui lòng điều chỉnh khoảng cách");
            apiResponse.setResult(null);
            return apiResponse;
        }

        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setMessage("Lấy user thành công");
        apiResponse.setResult(results);
        return apiResponse;
    }

    @GetMapping("/get-setting-user")
    public ApiResponse<UserSettingResponse> getUserSetting() {
        ApiResponse<UserSettingResponse> apiResponse = new ApiResponse<>();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setMessage("Thành công");
        apiResponse.setResult(userService.getUserSetting());
        return apiResponse;
    }

    @PatchMapping("/update-setting-user")
    public ApiResponse<UserSettingResponse> updateSetting(@RequestBody UserSettingResponse request){
        ApiResponse<UserSettingResponse> apiResponse = new ApiResponse<>();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setMessage("Thành công");
        apiResponse.setResult(userService.updateUserSetting(request));
        return apiResponse;
    }

    @GetMapping("/get-user-likes")
    public ApiResponse<List<UserMatchResult>> getUserLikes() {
        ApiResponse<List<UserMatchResult>> apiResponse = new ApiResponse<>();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setMessage("Thanh cong");
        apiResponse.setResult(userService.findAllUserLike());
        return apiResponse;
    }

    @GetMapping("/get-profile")
    public ApiResponse<ProfileResponse> getProfile(){
        ApiResponse<ProfileResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.getProfile());
        apiResponse.setMessage("Thanh Cong");
        apiResponse.setCode(HttpStatus.OK.value());
        return apiResponse;
    }

    @GetMapping("get-user-management")
    public ApiResponse<List<UserManagement>> getUserManagement(){
        ApiResponse<List<UserManagement>> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.getUsersManagement());
        apiResponse.setCode(200);
        apiResponse.setMessage("Thanh Cong");
        return apiResponse;
    }

    @GetMapping("get-infor-dashboard")
    public ApiResponse<InforDashBoard> getInforDashBoard(){
        ApiResponse<InforDashBoard> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.getInforDashBoard());
        apiResponse.setCode(200);
        apiResponse.setMessage("Thanh Cong");
        return apiResponse;
    }
}
