package com.beerexpirytracker.repository;

import com.beerexpirytracker.model.Beer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BeerRepository extends JpaRepository<Beer, UUID> {
    
    List<Beer> findByUserId(UUID userId);
    
    @Query("SELECT b FROM Beer b WHERE b.reminderDate <= ?1 AND b.reminderCount < 5 AND b.expiryDate > CURRENT_DATE")
    List<Beer> findBeersNeedingReminders(LocalDate today);
    
    List<Beer> findByUserIdAndExpiryDateBetweenOrderByExpiryDateAsc(UUID userId, LocalDate startDate, LocalDate endDate);
    
    List<Beer> findByBrandNameContainingIgnoreCaseOrProductNameContainingIgnoreCase(String brandName, String productName);
}