package com.tradestorm.service;

import com.cdac.model.Cryptocurrency;
import com.cdac.model.Notification;
import com.cdac.model.User;
import com.tradestorm.dto.NotificationDTO;
import com.tradestorm.repository.NotificationRepository;
import com.tradestorm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public NotificationDTO createNotification(String message, Long userId, Cryptocurrency crypto) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        User user = userOptional.get();

        // ✅ Check for existing notification in the last 1 hour
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        boolean exists = notificationRepository.existsByUserAndCryptocurrencyAndMessageAndTimestampAfter(
                user, crypto, message, oneHourAgo);

        if (exists) {
            return null; // 🔁 Suppress duplicate notification
        }

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setCryptocurrency(crypto);
        notification.setMessage(message);
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead(false);

        Notification saved = notificationRepository.save(notification);
        return convertToDTO(saved);
    }

    @Override
    public List<NotificationDTO> getNotificationsByUserId(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        List<Notification> notifications = notificationRepository.findByUser(userOptional.get());
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getByCryptocurrency(Cryptocurrency crypto) {
        List<Notification> notifications = notificationRepository.findByCryptocurrency(crypto);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void markAllAsRead(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        List<Notification> notifications = notificationRepository.findByUser(userOptional.get());
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotifId(notification.getNotifId());
        dto.setUserId(notification.getUser().getUserId());
        dto.setCryptoId(notification.getCryptocurrency().getCryptoId());
        dto.setMessage(notification.getMessage());
        dto.setTimestamp(notification.getTimestamp());
        dto.setRead(notification.getRead());
        dto.setCryptoSymbol(notification.getCryptocurrency().getSymbol());
        return dto;
    }
}
