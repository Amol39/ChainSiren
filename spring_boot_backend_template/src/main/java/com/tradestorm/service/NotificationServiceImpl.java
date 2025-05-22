package com.tradestorm.service;

import com.cdac.model.Cryptocurrency;
import com.cdac.model.Notification;
import com.cdac.model.User;
import com.tradestorm.dto.NotificationDTO;
import com.tradestorm.repository.NotificationRepository;

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

	private NotificationRepository notificationRepository;
	private final ModelMapper modelMapper;

	@Override
	public NotificationDTO createNotification(String message, User user, Cryptocurrency crypto) {

		Optional<Notification> existing = notificationRepository.findDuplicate(user, crypto, message);

		if (existing.isPresent()) {
			// Return DTO of existing notification instead of inserting duplicate
			return modelMapper.map(existing.get(), NotificationDTO.class);
		}

		Notification notification = new Notification();
		notification.setMessage(message);
		notification.setUser(user);
		notification.setCryptocurrency(crypto);
		notification.setTimestamp(LocalDateTime.now());

		Notification saved = notificationRepository.save(notification);
		return modelMapper.map(saved, NotificationDTO.class);
	}

	@Override
	public List<NotificationDTO> getUserNotifications(User user) {
	    List<Notification> notifications = notificationRepository.findByUser(user);
	    return notifications.stream()
	            .map(n -> modelMapper.map(n, NotificationDTO.class))
	            .collect(Collectors.toList());
	}

	@Override
	public List<NotificationDTO> getByCryptocurrency(Cryptocurrency crypto) {
	    List<Notification> notifications = notificationRepository.findByCryptocurrency(crypto);
	    return notifications.stream()
	            .map(n -> modelMapper.map(n, NotificationDTO.class))
	            .collect(Collectors.toList());
	}
}
