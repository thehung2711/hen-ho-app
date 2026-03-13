package com.tinder.tinder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TinderApplication {

    public static void main(String[] args) {
        SpringApplication.run(TinderApplication.class, args);
    }

}
