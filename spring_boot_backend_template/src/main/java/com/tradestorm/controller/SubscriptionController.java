package com.tradestorm.controller;

import com.tradestorm.dto.SubscriptionDTO;
import com.tradestorm.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@AllArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Operation(summary = "Subscribe a user to a cryptocurrency")
    @PostMapping
    public ResponseEntity<?> subscribe(@RequestBody SubscriptionDTO dto) {
        return ResponseEntity.ok(subscriptionService.createSubscription(dto));
    }

    @Operation(summary = "Get all subscriptions of a user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSubscriptions(@PathVariable Long userId) {
        return ResponseEntity.ok(subscriptionService.getUserSubscriptions(userId));
    }

    @Operation(summary = "Update a user's subscription")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubscription(@PathVariable Long id, @RequestBody SubscriptionDTO dto) {
        return ResponseEntity.ok(subscriptionService.updateSubscription(id, dto));
    }

    @Operation(summary = "Delete a subscription")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }
}
