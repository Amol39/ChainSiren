package com.tradestorm.controller;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.model.User;
import com.tradestorm.dto.UserDTO;
import com.tradestorm.service.NotificationService;
import com.tradestorm.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@AllArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getNotificationsByUser(@PathVariable Long userId) {
        UserDTO dto = userService.getUserById(userId);
        User user = modelMapper.map(dto, User.class);
        return ResponseEntity.ok(notificationService.getUserNotifications(user));
    }
}
