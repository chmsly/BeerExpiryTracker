package com.beerexpirytracker.dto;

import java.time.LocalDate;
import java.util.UUID;

public class BeerDTO {
    
    private UUID id;
    private String brandName;
    private String productName;
    private String type;
    private LocalDate expiryDate;
    private String imageUrl;
    
    // Constructors
    public BeerDTO() {
    }
    
    public BeerDTO(UUID id, String brandName, String productName, String type, LocalDate expiryDate, String imageUrl) {
        this.id = id;
        this.brandName = brandName;
        this.productName = productName;
        this.type = type;
        this.expiryDate = expiryDate;
        this.imageUrl = imageUrl;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getBrandName() {
        return brandName;
    }
    
    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public LocalDate getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
} 