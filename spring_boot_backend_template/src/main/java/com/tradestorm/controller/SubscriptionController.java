// SubscriptionController.java
package com.tradestorm.controller;

import com.tradestorm.dto.SubscriptionDTO;
import com.tradestorm.service.SubscriptionService;

import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@AllArgsConstructor
public class SubscriptionController {

    
    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<?> subscribe(@RequestBody SubscriptionDTO dto) {
        return ResponseEntity.ok(subscriptionService.createSubscription(dto)) ;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSubscriptions(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getUserSubscriptions(userId));
    }
}
