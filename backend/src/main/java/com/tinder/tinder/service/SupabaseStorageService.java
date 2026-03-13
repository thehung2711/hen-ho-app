package com.tinder.tinder.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SupabaseStorageService {

    private static final Logger logger = LoggerFactory.getLogger(SupabaseStorageService.class);


    private String supabaseUrl = "https://jgpbxuttuorkjaajguyg.supabase.co";


    private String supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncGJ4dXR0dW9ya2phYWpndXlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ0NjA4MSwiZXhwIjoyMDc2MDIyMDgxfQ.lKMq_ffDUZ4Qbudv0KcufFqrVJj7-Mo8nZw9JsrcqQU";


    private String bucketName = "uploads";

    private final RestTemplate restTemplate;

    public SupabaseStorageService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Xóa một file từ Supabase Storage
     * @param filePath Đường dẫn file trong bucket (ví dụ: "uploads/1760875193781_tzavk8u.jpg")
     * @return true nếu xóa thành công, false nếu thất bại
     */
    public boolean deleteFile(String filePath) {
        try {
            String url = String.format("%s/storage/v1/object/%s/%s",
                    supabaseUrl, bucketName, filePath);

            logger.info("Đang xóa file: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.DELETE,
                    entity,
                    String.class
            );

            logger.info("Xóa file thành công: {}", filePath);
            return response.getStatusCode() == HttpStatus.OK ||
                    response.getStatusCode() == HttpStatus.NO_CONTENT;

        } catch (HttpClientErrorException e) {
            logger.error("Lỗi HTTP khi xóa file {}: {} - {}",
                    filePath, e.getStatusCode(), e.getResponseBodyAsString());
            return false;
        } catch (Exception e) {
            logger.error("Lỗi không xác định khi xóa file {}: {}",
                    filePath, e.getMessage());
            return false;
        }
    }

    /**
     * Xóa nhiều file từ Supabase Storage
     * @param filePaths Danh sách đường dẫn file cần xóa
     * @return true nếu xóa thành công, false nếu thất bại
     */
    public boolean deleteMultipleFiles(String[] filePaths) {
        try {
            String url = String.format("%s/storage/v1/object/%s",
                    supabaseUrl, bucketName);

            logger.info("Đang xóa {} files", filePaths.length);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseKey);
            headers.set("apikey", supabaseKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Tạo JSON body với danh sách file
            StringBuilder jsonBody = new StringBuilder("{\"prefixes\":[");
            for (int i = 0; i < filePaths.length; i++) {
                jsonBody.append("\"").append(filePaths[i]).append("\"");
                if (i < filePaths.length - 1) {
                    jsonBody.append(",");
                }
            }
            jsonBody.append("]}");

            HttpEntity<String> entity = new HttpEntity<>(jsonBody.toString(), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.DELETE,
                    entity,
                    String.class
            );

            logger.info("Xóa nhiều file thành công");
            return response.getStatusCode() == HttpStatus.OK ||
                    response.getStatusCode() == HttpStatus.NO_CONTENT;

        } catch (Exception e) {
            logger.error("Lỗi khi xóa nhiều file: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Xóa file bằng URL công khai
     * @param publicUrl URL công khai của file
     * @return true nếu xóa thành công
     */
    public boolean deleteFileByPublicUrl(String publicUrl) {
        try {
            String filePath = extractFilePathFromUrl(publicUrl);
            logger.info("File path được trích xuất: {}", filePath);
            return deleteFile(filePath);
        } catch (Exception e) {
            logger.error("Lỗi khi xóa file từ URL: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Trích xuất file path từ URL công khai của Supabase
     */
    private String extractFilePathFromUrl(String publicUrl) {
        // Format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file.jpg
        String marker = "/object/public/" + bucketName + "/";
        int index = publicUrl.indexOf(marker);
        if (index != -1) {
            return publicUrl.substring(index + marker.length());
        }
        throw new IllegalArgumentException("URL không hợp lệ: " + publicUrl);
    }

}