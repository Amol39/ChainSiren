package com.tradestorm.service;

import com.cdac.model.Cryptocurrency;
import com.tradestorm.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {
	NotificationDTO createNotification(String message, Long userId, Cryptocurrency crypto);

	List<NotificationDTO> getNotificationsByUserId(Long userId);

	List<NotificationDTO> getByCryptocurrency(Cryptocurrency crypto);

	void markAllAsRead(Long userId);
}
