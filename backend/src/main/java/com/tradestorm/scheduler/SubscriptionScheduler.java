package com.tradestorm.scheduler;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.cdac.model.Subscription;
import com.cdac.model.User;
import com.tradestorm.repository.SubscriptionRepository;
import com.tradestorm.util.EmailService;
import com.tradestorm.util.SmsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class SubscriptionScheduler {

    private final SubscriptionRepository subscriptionRepository;
    private final EmailService emailService;
    private final SmsService smsService;

    @Scheduled(cron = "0 0 0 * * *") // Every day at midnight
    public void deactivateExpiredSubscriptions() {
        LocalDate today = LocalDate.now();
        log.info("Checking for expired subscriptions...");

        List<Subscription> expiring = subscriptionRepository.findExpiringToday(today);

        for (Subscription sub : expiring) {
            User user = sub.getUser();
            String message = "Hi " + user.getName() + ", your ChainSiren subscription expired on " + sub.getEndDate() + ". Renew to continue receiving alerts.";

            if ("EMAIL".equalsIgnoreCase(user.getNotificationPreference())) {
                emailService.sendEmail(user.getEmail(), "Subscription Expired", message);
            } else if ("SMS".equalsIgnoreCase(user.getNotificationPreference())) {
                smsService.sendSms(user.getPhone(), message);
            }
        }

        subscriptionRepository.deactivateExpired(today);
        log.info("Expired subscriptions deactivated and notified.");
    }
}
