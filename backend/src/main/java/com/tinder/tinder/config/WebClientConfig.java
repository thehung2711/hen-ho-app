package com.tinder.tinder.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Bean(name = "osmWebClient")
    public WebClient osmWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl("https://nominatim.openstreetmap.org")
                .defaultHeader(HttpHeaders.USER_AGENT, "SpringBootApp/1.0")
                .build();
    }

    @Bean(name = "graphHopperWebClient")
    public WebClient graphHopperWebClient(WebClient.Builder builder) {
        return builder
                .baseUrl("https://graphhopper.com/api/1") // ví dụ GraphHopper API
                .defaultHeader(HttpHeaders.USER_AGENT, "SpringBootApp/1.0")
                .build();
    }
}
