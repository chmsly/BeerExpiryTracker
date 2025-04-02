package com.beerexpirytracker.controller;

import com.beerexpirytracker.dto.UserDTO;
import com.beerexpirytracker.security.UserDetailsImpl;
import com.beerexpirytracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        UserDTO user = userService.getUserById(userDetails.getId());
        return ResponseEntity.ok(user);
    }
    
    @PatchMapping("/device-token")
    public ResponseEntity<?> updateDeviceToken(
            @RequestBody Map<String, String> tokenRequest,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (!tokenRequest.containsKey("deviceToken")) {
            return ResponseEntity.badRequest().body(createErrorResponse("Device token is required"));
        }
        
        String deviceToken = tokenRequest.get("deviceToken");
        userService.updateDeviceToken(userDetails.getUsername(), deviceToken);
        
        return ResponseEntity.ok(createSuccessResponse("Device token updated successfully"));
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