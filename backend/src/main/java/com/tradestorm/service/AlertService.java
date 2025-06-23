// SubscriptionService.java
package com.tradestorm.service;

import com.tradestorm.dto.AlertDTO;
import com.tradestorm.dto.AlertRespDTO;

import java.util.List;

public interface AlertService {
	AlertRespDTO createAlert(AlertDTO dto);
    List<AlertDTO> getUserAlerts(Long userId);
    AlertDTO updateAlert(Long id, AlertDTO dto);
    void deleteAlert(Long id);
}
