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
import java.time.temporal.ChronoUnit;
import java.util.*;
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
    
    public Map<String, Object> getExpiryTimelineStats(UUID userId) {
        List<Beer> userBeers = beerRepository.findByUserId(userId);
        LocalDate today = LocalDate.now();
        
        Map<String, Object> result = new HashMap<>();
        
        // Group beers by expiry status
        long expired = userBeers.stream()
                .filter(beer -> beer.getExpiryDate().isBefore(today))
                .count();
        
        long expiringWithin30Days = userBeers.stream()
                .filter(beer -> !beer.getExpiryDate().isBefore(today) && 
                               beer.getExpiryDate().isBefore(today.plusDays(30)))
                .count();
        
        long expiringWithin90Days = userBeers.stream()
                .filter(beer -> !beer.getExpiryDate().isBefore(today) && 
                               beer.getExpiryDate().isBefore(today.plusDays(90)) &&
                               !beer.getExpiryDate().isBefore(today.plusDays(30)))
                .count();
        
        long expiringAfter90Days = userBeers.stream()
                .filter(beer -> !beer.getExpiryDate().isBefore(today.plusDays(90)))
                .count();
        
        Map<String, Long> expiryBreakdown = new HashMap<>();
        expiryBreakdown.put("expired", expired);
        expiryBreakdown.put("within30Days", expiringWithin30Days);
        expiryBreakdown.put("within90Days", expiringWithin90Days);
        expiryBreakdown.put("after90Days", expiringAfter90Days);
        
        result.put("expiryBreakdown", expiryBreakdown);
        
        // Monthly expiry count for the next 6 months
        Map<String, Long> monthlyExpiry = new HashMap<>();
        for (int i = 0; i < 6; i++) {
            LocalDate monthStart = today.plusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            
            long count = userBeers.stream()
                    .filter(beer -> !beer.getExpiryDate().isBefore(monthStart) && 
                                   !beer.getExpiryDate().isAfter(monthEnd))
                    .count();
            
            monthlyExpiry.put(monthStart.getYear() + "-" + monthStart.getMonthValue(), count);
        }
        
        result.put("monthlyExpiry", monthlyExpiry);
        
        return result;
    }
    
    public Map<String, Long> getTypeDistributionStats(UUID userId) {
        List<Beer> userBeers = beerRepository.findByUserId(userId);
        
        // Group beers by type and count them
        Map<String, Long> typeDistribution = userBeers.stream()
                .collect(Collectors.groupingBy(
                    beer -> beer.getType() != null && !beer.getType().trim().isEmpty() ? beer.getType() : "Unknown",
                    Collectors.counting()
                ));
        
        return typeDistribution;
    }
    
    public Map<String, Long> getBrandDistributionStats(UUID userId) {
        List<Beer> userBeers = beerRepository.findByUserId(userId);
        
        // Group beers by brand and count them, limiting to top 10
        Map<String, Long> brandCounts = userBeers.stream()
                .collect(Collectors.groupingBy(Beer::getBrandName, Collectors.counting()));
        
        // Sort by count in descending order and take top 10
        return brandCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(
                    Map.Entry::getKey,
                    Map.Entry::getValue,
                    (e1, e2) -> e1,
                    LinkedHashMap::new
                ));
    }
    
    public Map<String, Object> getStatsSummary(UUID userId) {
        List<Beer> userBeers = beerRepository.findByUserId(userId);
        LocalDate today = LocalDate.now();
        
        Map<String, Object> summary = new HashMap<>();
        
        // Total beers count
        summary.put("totalBeers", userBeers.size());
        
        // Expired beers count
        long expiredCount = userBeers.stream()
                .filter(beer -> beer.getExpiryDate().isBefore(today))
                .count();
        summary.put("expiredBeers", expiredCount);
        
        // Beers expiring soon (within 30 days)
        long expiringSoonCount = userBeers.stream()
                .filter(beer -> !beer.getExpiryDate().isBefore(today) && 
                               beer.getExpiryDate().isBefore(today.plusDays(30)))
                .count();
        summary.put("expiringSoon", expiringSoonCount);
        
        // Calculate average days until expiry for non-expired beers
        OptionalDouble avgDaysUntilExpiry = userBeers.stream()
                .filter(beer -> !beer.getExpiryDate().isBefore(today))
                .mapToLong(beer -> ChronoUnit.DAYS.between(today, beer.getExpiryDate()))
                .average();
        
        summary.put("avgDaysUntilExpiry", avgDaysUntilExpiry.isPresent() ? avgDaysUntilExpiry.getAsDouble() : 0);
        
        // Most common beer types (top 3)
        Map<String, Long> typeDistribution = userBeers.stream()
                .filter(beer -> beer.getType() != null && !beer.getType().trim().isEmpty())
                .collect(Collectors.groupingBy(Beer::getType, Collectors.counting()));
        
        List<Map.Entry<String, Long>> topTypes = typeDistribution.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(3)
                .collect(Collectors.toList());
        
        summary.put("topBeerTypes", topTypes.stream()
                .map(entry -> Map.of("type", entry.getKey(), "count", entry.getValue()))
                .collect(Collectors.toList()));
        
        return summary;
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