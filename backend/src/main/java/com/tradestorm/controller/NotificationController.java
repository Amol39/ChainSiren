package com.tradestorm.controller;

import com.cdac.model.Cryptocurrency;
import com.cdac.model.User;
import com.tradestorm.dto.NotificationDTO;
import com.tradestorm.dto.UserDTO;
import com.tradestorm.service.CryptocurrencyService;
import com.tradestorm.service.NotificationService;
import com.tradestorm.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final CryptocurrencyService cryptocurrencyService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Operation(summary = "Create a new notification for a user and crypto")
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestParam String message,
            @RequestParam Long userId,
            @RequestParam String cryptoSymbol) {

        UserDTO dto = userService.getUserById(userId);
        User user = modelMapper.map(dto, User.class);
        Cryptocurrency crypto = cryptocurrencyService.getBySymbol(cryptoSymbol);

        NotificationDTO created = notificationService.createNotification(message, user, crypto);
        return ResponseEntity.ok(created);
    }

    @Operation(summary = "Get all notifications for a user")
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getNotificationsByUser(@PathVariable Long userId) {
        UserDTO dto = userService.getUserById(userId);
        User user = modelMapper.map(dto, User.class);
        return ResponseEntity.ok(notificationService.getUserNotifications(user));
    }

    @Operation(summary = "Get all notifications by crypto symbol")
    @GetMapping("/crypto/{symbol}")
    public ResponseEntity<?> getNotificationsByCrypto(@PathVariable String symbol) {
        Cryptocurrency crypto = cryptocurrencyService.getBySymbol(symbol);
        return ResponseEntity.ok(notificationService.getByCryptocurrency(crypto));
    }
}
