package com.tinder.tinder.service.impl;

import com.tinder.tinder.dto.request.CreateInforUser;
import com.tinder.tinder.dto.request.RegisterRequest;
import com.tinder.tinder.dto.request.UserUpdate;
import com.tinder.tinder.dto.response.*;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface IUserService {
    void createUser(RegisterRequest user);
    void updateInforUser(CreateInforUser inforUser);
    void updateAddressUser(String addressLat, String addressLon);
    void changePassword(String oldPassword, String newPassword);
    Boolean checkUser();
    void updateUser(UserUpdate userUpdate);
    List<UserMatchResult> findMatches();
    UserSettingResponse getUserSetting();
    UserSettingResponse updateUserSetting(UserSettingResponse update);
    List<UserMatchResult> findAllUserLike();
    ProfileResponse getProfile();
    List<UserManagement> getUsersManagement();
    InforDashBoard getInforDashBoard();
}
