package com.beerexpirytracker.dto;

import java.util.UUID;

public class UserDTO {
    
    private UUID id;
    private String username;
    private String email;
    private String deviceToken;
    
    // Constructors
    public UserDTO() {
    }
    
    public UserDTO(UUID id, String username, String email, String deviceToken) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.deviceToken = deviceToken;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getDeviceToken() {
        return deviceToken;
    }
    
    public void setDeviceToken(String deviceToken) {
        this.deviceToken = deviceToken;
    }
} 