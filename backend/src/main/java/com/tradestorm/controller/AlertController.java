package com.tradestorm.controller;

import com.tradestorm.dto.AlertDTO;
import com.tradestorm.dto.AlertRespDTO;
import com.tradestorm.dto.UpdateAlertDTO;
import com.tradestorm.service.AlertService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@AllArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping("/add")
    public ResponseEntity<AlertRespDTO> createAlert(@RequestBody AlertDTO dto) {
        return ResponseEntity.ok(alertService.createAlert(dto));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<AlertRespDTO> updateAlert(@PathVariable Long id, @RequestBody UpdateAlertDTO dto) {
        return ResponseEntity.ok(alertService.updateAlertAndReturnResp(id, dto));
    }

    @GetMapping("/{userId}/{symbol}")
    public ResponseEntity<List<AlertRespDTO>> getUserAlertsForSymbol(@PathVariable Long userId, @PathVariable String symbol) {
        return ResponseEntity.ok(alertService.getUserAlertsForSymbol(userId, symbol));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AlertRespDTO>> getAllAlertsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(alertService.getUserAlerts(userId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
        return ResponseEntity.noContent().build();
    }
}
