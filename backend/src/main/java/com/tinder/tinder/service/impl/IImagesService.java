package com.tinder.tinder.service.impl;

import com.tinder.tinder.dto.request.UpdateUserImagesDTO;
import com.tinder.tinder.model.Users;

import java.util.List;

public interface IImagesService {
    void addImage(String src);
    void updateUserImage(UpdateUserImagesDTO updateUserImagesDTO);
}
