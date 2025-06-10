package com.tradestorm.controller;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.model.Cryptocurrency;
import com.cdac.model.User;
import com.tradestorm.dto.NotificationDTO;
import com.tradestorm.dto.UserDTO;
import com.tradestorm.service.CryptocurrencyService;
import com.tradestorm.service.NotificationService;
import com.tradestorm.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final CryptocurrencyService cryptocurrencyService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    
    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(
            @RequestParam String message,
            @RequestParam Long userId,
            @RequestParam String cryptoSymbol) {

    	UserDTO dto = userService.getUserById(userId); // Assume this throws if not found
    	User user = modelMapper.map(dto, User.class);
        Cryptocurrency crypto = cryptocurrencyService.getBySymbol(cryptoSymbol); // Updated to throw exception

        NotificationDTO created = notificationService.createNotification(message, user, crypto);
        return ResponseEntity.ok(created);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getNotificationsByUser(@PathVariable Long userId) {
        UserDTO dto = userService.getUserById(userId);
        User user = modelMapper.map(dto, User.class);
        return ResponseEntity.ok(notificationService.getUserNotifications(user));
    }
    
    @GetMapping("/crypto/{symbol}")
    public ResponseEntity<?> getNotificationsByCrypto(@PathVariable String symbol) {
    	
        Cryptocurrency crypto = cryptocurrencyService.getBySymbol(symbol); // throws if not found
        return ResponseEntity.ok(notificationService.getByCryptocurrency(crypto));
    }
    
}
