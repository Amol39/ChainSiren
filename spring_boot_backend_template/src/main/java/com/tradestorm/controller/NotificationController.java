package com.tradestorm.controller;

import com.cdac.model.Cryptocurrency;
import com.tradestorm.dto.NotificationDTO;
import com.tradestorm.service.CryptocurrencyService;
import com.tradestorm.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final CryptocurrencyService cryptocurrencyService;

    @Operation(summary = "Create a new notification for a user and crypto")
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestParam String message,
            @RequestParam Long userId,
            @RequestParam String cryptoSymbol) {

        Cryptocurrency crypto = cryptocurrencyService.getBySymbol(cryptoSymbol);
        NotificationDTO created = notificationService.createNotification(message, userId, crypto);
        return ResponseEntity.ok(created);
    }

    @Operation(summary = "Get all notifications for a user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getNotificationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUserId(userId));
    }

    @Operation(summary = "Get all notifications by crypto symbol")
    @GetMapping("/crypto/{symbol}")
    public ResponseEntity<?> getNotificationsByCrypto(@PathVariable String symbol) {
        Cryptocurrency crypto = cryptocurrencyService.getBySymbol(symbol);
        return ResponseEntity.ok(notificationService.getByCryptocurrency(crypto));
    }

    @PutMapping("/mark-read/{userId}")
    public ResponseEntity<Void> markAllNotificationsAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
}
