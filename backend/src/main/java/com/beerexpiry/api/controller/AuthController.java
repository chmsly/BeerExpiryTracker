package com.beerexpiry.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Object loginRequest) {
        // TODO: Implement login logic
        return ResponseEntity.ok("Login endpoint stub");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Object registerRequest) {
        // TODO: Implement register logic
        return ResponseEntity.ok("Register endpoint stub");
    }
} 