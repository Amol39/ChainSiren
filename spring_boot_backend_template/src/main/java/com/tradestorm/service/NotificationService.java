package com.tradestorm.service;

import com.cdac.model.Cryptocurrency;
import com.cdac.model.User;
import com.tradestorm.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {

    NotificationDTO createNotification(String message, User user, Cryptocurrency crypto);

    List<NotificationDTO> getUserNotifications(User user);

    List<NotificationDTO> getByCryptocurrency(Cryptocurrency crypto);
}
