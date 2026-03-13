package com.tinder.tinder.service;

import com.tinder.tinder.dto.request.UpdateUserImagesDTO;
import com.tinder.tinder.dto.request.UserImageDTO;
import com.tinder.tinder.exception.AppException;
import com.tinder.tinder.exception.ErrorException;
import com.tinder.tinder.model.Images;
import com.tinder.tinder.model.Users;
import com.tinder.tinder.repository.ImagesRepository;
import com.tinder.tinder.repository.UserRepository;
import com.tinder.tinder.service.impl.IImagesService;
import com.tinder.tinder.utils.UtilsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImagesService implements IImagesService {
    private final ImagesRepository imagesRepository;
    private final UtilsService utilsService;
    private final UserRepository userRepository;
    private final SupabaseStorageService supabaseStorageService;
    public ImagesService(ImagesRepository imagesRepository, UtilsService utilsService, UserRepository userRepository, SupabaseStorageService supabaseStorageService) {
        this.imagesRepository = imagesRepository;
        this.utilsService = utilsService;
        this.userRepository = userRepository;
        this.supabaseStorageService = supabaseStorageService;
    }

    @Override
    public void addImage(String src) {
        Long userId = utilsService.getUserIdFromToken();
        Optional<Users> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new AppException(ErrorException.USER_NOT_EXIST);
        }
        Users user = userOptional.get();
        Images image = new Images();
        image.setUrl(src);
        image.setStatus(1);
        image.setUsers(user);
        imagesRepository.save(image);
    }

    @Override
    public void updateUserImage(UpdateUserImagesDTO request) {
        Long userId = utilsService.getUserIdFromToken();
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        // Xoá ảnh
        for (String imageUrl : request.getDeletedImages()) {
            try {
                supabaseStorageService.deleteFileByPublicUrl(imageUrl);
                Optional<Images> imageOptional = imagesRepository.findByUrl(imageUrl);
                imageOptional.ifPresent(imagesRepository::delete);

            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("Không thể xoá ảnh " + imageUrl + ". Lỗi: " + e.getMessage());
            }
        }

        // Thêm ảnh mới (giữ nguyên logic của bạn)
        if (request.getNewImages() != null) {
            for (String dto : request.getNewImages()) {
                Images image = new Images();
                image.setUsers(user);
                image.setStatus(1);
                image.setUrl(dto);
                imagesRepository.save(image);
            }
        }
    }

}
