package com.tradestorm.scheduler;

import com.tradestorm.service.OtpServiceImpl;

import lombok.AllArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class OtpScheduler {

    private final OtpServiceImpl otpService;

    
    @Scheduled(fixedRate = 5 * 60 * 1000) // every 5 minutes
    public void cleanupExpiredOtps() {
        otpService.cleanupExpiredOtps();
    }
}
