package com.tradestorm.service;

import com.cdac.model.Cryptocurrency;
import com.cdac.model.Notification;
import com.cdac.model.User;
import com.tradestorm.dto.NotificationDTO;
import com.tradestorm.repository.NotificationRepository;
import com.tradestorm.util.EmailService;
import com.tradestorm.util.SmsService;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final ModelMapper modelMapper;
    private final SmsService smsService;
    private final EmailService emailService;
    
    @Override
    public NotificationDTO createNotification(String message, User user, Cryptocurrency crypto) {
        Optional<Notification> existing = notificationRepository.findDuplicate(user, crypto, message);

        if (existing.isPresent()) {
            return modelMapper.map(existing.get(), NotificationDTO.class);
        }

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setUser(user);
        notification.setCryptocurrency(crypto);
        notification.setTimestamp(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        sendUserNotification(user, message); // <== NEW LINE

        return modelMapper.map(saved, NotificationDTO.class);
    }

    private void sendUserNotification(User user, String message) {
        String pref = user.getNotificationPreference(); // Expected: "SMS", "EMAIL", "BOTH"

        if ("EMAIL".equalsIgnoreCase(pref) || "BOTH".equalsIgnoreCase(pref)) {
        	emailService.sendEmail(user.getEmail(), "Crypto Alert", message);
        }

        if ("SMS".equalsIgnoreCase(pref) || "BOTH".equalsIgnoreCase(pref)) {
            smsService.sendSms(user.getPhone(), message);
        }
    }


    @Override
    public List<NotificationDTO> getUserNotifications(User user) {
        return notificationRepository.findByUser(user)
                .stream()
                .map(n -> modelMapper.map(n, NotificationDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getByCryptocurrency(Cryptocurrency crypto) {
        return notificationRepository.findByCryptocurrency(crypto)
                .stream()
                .map(n -> modelMapper.map(n, NotificationDTO.class))
                .collect(Collectors.toList());
    }
}
