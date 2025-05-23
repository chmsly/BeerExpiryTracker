package com.beerexpiry.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/packages")
public class PackageController {
    @GetMapping
    public ResponseEntity<?> getPackages() {
        // TODO: Implement get packages logic
        return ResponseEntity.ok("Get packages endpoint stub");
    }

    @PostMapping
    public ResponseEntity<?> createPackage(@RequestBody Object packageRequest) {
        // TODO: Implement create package logic
        return ResponseEntity.ok("Create package endpoint stub");
    }

    @PatchMapping("/{id}/reminder")
    public ResponseEntity<?> updateReminder(@PathVariable String id) {
        // TODO: Implement update reminder logic
        return ResponseEntity.ok("Update reminder endpoint stub");
    }
} 