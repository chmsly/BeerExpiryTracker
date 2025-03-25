package com.beerexpirytracker.service;

import com.beerexpirytracker.dto.BeerDTO;
import com.beerexpirytracker.model.Beer;
import com.beerexpirytracker.model.User;
import com.beerexpirytracker.repository.BeerRepository;
import com.beerexpirytracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BeerService {
    
    @Autowired
    private BeerRepository beerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    public List<BeerDTO> getAllBeersByUser(UUID userId) {
        return beerRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public BeerDTO getBeerById(UUID id, UUID userId) {
        Beer beer = beerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Beer not found with id: " + id));
        
        if (!beer.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to access this beer");
        }
        
        return convertToDTO(beer);
    }
    
    @Transactional
    public BeerDTO createBeer(String brandName, String productName, String type, LocalDate expiryDate, 
                              MultipartFile image, UUID userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Beer beer = new Beer();
        beer.setBrandName(brandName);
        beer.setProductName(productName);
        beer.setType(type);
        beer.setExpiryDate(expiryDate);
        beer.setUser(user);
        
        // Save the beer first to get an ID
        Beer savedBeer = beerRepository.save(beer);
        
        // Handle image upload
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image, savedBeer.getId());
            savedBeer.setImageUrl(imagePath);
            savedBeer = beerRepository.save(savedBeer);
        }
        
        return convertToDTO(savedBeer);
    }
    
    @Transactional
    public BeerDTO updateBeer(UUID id, String brandName, String productName, String type, LocalDate expiryDate, 
                              MultipartFile image, UUID userId) throws IOException {
        Beer beer = beerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Beer not found with id: " + id));
        
        if (!beer.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this beer");
        }
        
        beer.setBrandName(brandName);
        beer.setProductName(productName);
        beer.setType(type);
        beer.setExpiryDate(expiryDate);
        
        // Handle image upload
        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image, id);
            beer.setImageUrl(imagePath);
        }
        
        Beer updatedBeer = beerRepository.save(beer);
        return convertToDTO(updatedBeer);
    }
    
    @Transactional
    public void deleteBeer(UUID id, UUID userId) {
        Beer beer = beerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Beer not found with id: " + id));
        
        if (!beer.getUser().getId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this beer");
        }
        
        // Delete the associated image if exists
        if (beer.getImageUrl() != null) {
            try {
                Path imagePath = Paths.get(beer.getImageUrl());
                Files.deleteIfExists(imagePath);
            } catch (IOException e) {
                // Log the error but continue with beer deletion
                System.err.println("Failed to delete image: " + e.getMessage());
            }
        }
        
        beerRepository.delete(beer);
    }
    
    public List<BeerDTO> searchBeers(String query, UUID userId) {
        return beerRepository.findByBrandNameContainingIgnoreCaseOrProductNameContainingIgnoreCase(query, query)
                .stream()
                .filter(beer -> beer.getUser().getId().equals(userId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<BeerDTO> getUpcomingExpiringBeers(UUID userId, int daysAhead) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(daysAhead);
        
        return beerRepository.findByUserIdAndExpiryDateBetweenOrderByExpiryDateAsc(userId, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private String saveImage(MultipartFile file, UUID beerId) throws IOException {
        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Create a unique file name
        String fileName = beerId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        
        // Save the file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return filePath.toString();
    }
    
    private BeerDTO convertToDTO(Beer beer) {
        return new BeerDTO(
                beer.getId(),
                beer.getBrandName(),
                beer.getProductName(),
                beer.getType(),
                beer.getExpiryDate(),
                beer.getImageUrl()
        );
    }
} 