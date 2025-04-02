package com.beerexpirytracker.controller;

import com.beerexpirytracker.dto.BeerDTO;
import com.beerexpirytracker.security.UserDetailsImpl;
import com.beerexpirytracker.service.BeerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/beers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BeerController {
    
    @Autowired
    private BeerService beerService;
    
    @GetMapping
    public ResponseEntity<List<BeerDTO>> getAllBeers(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<BeerDTO> beers = beerService.getAllBeersByUser(userDetails.getId());
        return ResponseEntity.ok(beers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BeerDTO> getBeerById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        BeerDTO beer = beerService.getBeerById(id, userDetails.getId());
        return ResponseEntity.ok(beer);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<BeerDTO>> searchBeers(
            @RequestParam String query,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<BeerDTO> beers = beerService.searchBeers(query, userDetails.getId());
        return ResponseEntity.ok(beers);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<BeerDTO>> getUpcomingExpiringBeers(
            @RequestParam(defaultValue = "30") int days,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<BeerDTO> beers = beerService.getUpcomingExpiringBeers(userDetails.getId(), days);
        return ResponseEntity.ok(beers);
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBeer(
            @RequestParam("brandName") String brandName,
            @RequestParam("productName") String productName,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam("expiryDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryDate,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            BeerDTO createdBeer = beerService.createBeer(
                    brandName, productName, type, expiryDate, image, userDetails.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBeer);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error uploading image: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBeer(
            @PathVariable UUID id,
            @RequestParam("brandName") String brandName,
            @RequestParam("productName") String productName,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam("expiryDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate expiryDate,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            BeerDTO updatedBeer = beerService.updateBeer(
                    id, brandName, productName, type, expiryDate, image, userDetails.getId());
            return ResponseEntity.ok(updatedBeer);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error uploading image: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBeer(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            beerService.deleteBeer(id, userDetails.getId());
            return ResponseEntity.ok(createSuccessResponse("Beer deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        }
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
    
    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        return response;
    }
} 