package com.tinder.tinder.utils;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class GraphHopperService {
    private final WebClient graphClient;

    @Value("${graphhopper.api.key}")
    private String apiKey; // đặt API key trong application.yml

    public GraphHopperService(@Qualifier("graphHopperWebClient") WebClient graphClient) {
        this.graphClient = graphClient;
    }


    /**
     * Tính khoảng cách giữa 2 vị trí (tính theo đường đi thực tế)
     *
     * @param lat1  Vĩ độ điểm 1
     * @param lon1  Kinh độ điểm 1
     * @param lat2  Vĩ độ điểm 2
     * @param lon2  Kinh độ điểm 2
     * @return Khoảng cách tính bằng mét (hoặc -1 nếu lỗi)
     */
    public Mono<Double> getDistance(String lat1, String lon1, String lat2, String lon2) {
        return graphClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/route")
                        .queryParam("point", lat1 + "," + lon1)
                        .queryParam("point", lat2 + "," + lon2)
                        .queryParam("vehicle", "car")
                        .queryParam("locale", "en")
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(response -> {
                    try {
                        return response
                                .get("paths")
                                .get(0)
                                .get("distance")
                                .asDouble();
                    } catch (Exception e) {
                        e.printStackTrace();
                        return -1.0;
                    }
                })
                .onErrorReturn(-1.0);
    }
}
