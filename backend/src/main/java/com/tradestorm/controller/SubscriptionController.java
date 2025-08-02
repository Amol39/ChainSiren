package com.tradestorm.controller;

import com.tradestorm.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestParam Long userId, @RequestParam int months) {
        return ResponseEntity.ok(subscriptionService.createSubscription(userId, months));
    }

    @GetMapping("/check")
    public ResponseEntity<?> isSubscribed(@RequestParam Long userId) {
        return ResponseEntity.ok(subscriptionService.isUserSubscribed(userId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSubscription(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionDetails(userId));
    }

}
