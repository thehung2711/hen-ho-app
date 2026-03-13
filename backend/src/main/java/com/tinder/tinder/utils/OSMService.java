package com.tinder.tinder.utils;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
public class OSMService {
    private final WebClient osmClient;

    public OSMService(@Qualifier("osmWebClient") WebClient osmClient) {
        this.osmClient = osmClient;
    }

    @Value("${graphhopper.api.key}")
    private String graphhopperApiKey;

    @Value("${graphhopper.api.url}")
    private String graphhopperApiUrl;

    public String getLocationName(String lat, String lon) {
        try {
            Map<String, Object> response = osmClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/reverse")
                            .queryParam("lat", lat)
                            .queryParam("lon", lon)
                            .queryParam("format", "json")
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return (response != null && response.containsKey("display_name"))
                    ? (String) response.get("display_name")
                    : "Không xác định";
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi OSM API: " + e.getMessage());
            return "Không xác định";
        }
    }

    public double calculateDistanceByOSM(String fromLat, String fromLon, String toLat, String toLon) {
        try {
            if (fromLat == null || fromLon == null || toLat == null || toLon == null
                    || fromLat.isEmpty() || fromLon.isEmpty() || toLat.isEmpty() || toLon.isEmpty()) {
                System.err.println("Lỗi: lat/lon không hợp lệ.");
                return 0.0;
            }

            //  Gọi API GraphHopper qua WebClient
            Map<String, Object> response = osmClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .scheme("https")
                            .host("graphhopper.com")
                            .path("/api/1/route")
                            .queryParam("point", fromLat + "," + fromLon)
                            .queryParam("point", toLat + "," + toLon)
                            .queryParam("vehicle", "car")
                            .queryParam("locale", "en")
                            .queryParam("key", graphhopperApiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            //  Đọc kết quả distance từ phản hồi
            if (response != null && response.containsKey("paths")) {
                List<Map<String, Object>> paths = (List<Map<String, Object>>) response.get("paths");
                if (!paths.isEmpty() && paths.get(0).containsKey("distance")) {
                    double distanceMeters = ((Number) paths.get(0).get("distance")).doubleValue();
                    return distanceMeters / 1000.0; // trả về km
                }
            }

            System.err.println(" GraphHopper không trả về khoảng cách hợp lệ.");
        } catch (Exception e) {
            System.err.println(" Lỗi khi tính khoảng cách qua GraphHopper: " + e.getMessage());
        }

        return 0.0;
    }



}
