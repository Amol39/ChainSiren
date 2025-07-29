package com.tradestorm.service;

import com.tradestorm.dto.AlertDTO;
import com.tradestorm.dto.AlertRespDTO;
import com.tradestorm.dto.UpdateAlertDTO;

import java.util.List;

public interface AlertService {

    AlertRespDTO createAlert(AlertDTO dto);

    List<AlertRespDTO> getUserAlerts(Long userId);

    List<AlertRespDTO> getUserAlertsForSymbol(Long userId, String symbol);

    AlertRespDTO updateAlertAndReturnResp(Long id, UpdateAlertDTO dto);

    void deleteAlert(Long id);
}
