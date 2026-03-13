package com.tinder.tinder.controller;


import com.tinder.tinder.dto.request.UpdateUserImagesDTO;
import com.tinder.tinder.dto.response.ApiResponse;
import com.tinder.tinder.repository.UserRepository;
import com.tinder.tinder.service.ImagesService;
import com.tinder.tinder.service.SupabaseStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImagesController {
    private final ImagesService imagesService;

    private final SupabaseStorageService storageService;

    @Autowired
    private UserRepository userRepository;

    public ImagesController(ImagesService imagesService, SupabaseStorageService storageService) {
        this.imagesService = imagesService;
        this.storageService = storageService;
    }


    @PutMapping("/update-image")
    public ApiResponse<String> updateImage(@RequestBody UpdateUserImagesDTO request) {
        ApiResponse response = new ApiResponse();
        imagesService.updateUserImage(request);
        response.setCode(HttpStatus.ACCEPTED.value());
        response.setMessage(HttpStatus.ACCEPTED.getReasonPhrase());
        return response;
    }

//    @DeleteMapping("/delete-images")
//    public String deleteImages(@RequestBody List<String> objectPaths) {
//        storageService.deleteImages(objectPaths);
//        return "Xóa thành công";
//    }

    @PostMapping("/delete-by-url")
    public ResponseEntity<Map<String, Object>> deleteFileByUrl(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String url = request.get("url");

        if (url == null || url.isEmpty()) {
            response.put("success", false);
            response.put("message", "URL không được để trống");
            return ResponseEntity.badRequest().body(response);
        }

        boolean success = storageService.deleteFileByPublicUrl(url);

        if (success) {
            response.put("success", true);
            response.put("message", "Xóa file thành công");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Xóa file thất bại");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/get-all-url")
    public ResponseEntity<List<String>> getAllUrl(@RequestParam Long id) {
        List<String> list = userRepository.getAllUrlByUser(id);
        return ResponseEntity.ok(list);
    }
}
