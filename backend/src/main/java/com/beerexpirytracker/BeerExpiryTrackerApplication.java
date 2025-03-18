package com.beerexpirytracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BeerExpiryTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(BeerExpiryTrackerApplication.class, args);
    }
} 