package com.tradestorm.controller;

import com.tradestorm.dto.AlertDTO;
import com.tradestorm.service.AlertService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@AllArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @Operation(summary = "Alert a user to a cryptocurrency")
    @PostMapping
    public ResponseEntity<?> subscribe(@RequestBody AlertDTO dto) {
        return ResponseEntity.ok(alertService.createAlert(dto));
    }

    @Operation(summary = "Get all alerts of a user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserSubscriptions(@PathVariable Long userId) {
        return ResponseEntity.ok(alertService.getUserAlerts(userId));
    }

    @Operation(summary = "Update a user's alert")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubscription(@PathVariable Long id, @RequestBody AlertDTO dto) {
        return ResponseEntity.ok(alertService.updateAlert(id, dto));
    }

    @Operation(summary = "Delete a alert")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlert(@PathVariable Long id) {
    	alertService.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }
}
