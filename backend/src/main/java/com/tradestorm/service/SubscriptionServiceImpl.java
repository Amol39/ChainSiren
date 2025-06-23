package com.tradestorm.service;

import com.cdac.model.Subscription;

import com.cdac.model.User;
import com.tradestorm.repository.SubscriptionRepository;
import com.tradestorm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Override
    public Subscription createSubscription(Long userId, int months) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(months);

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setStartDate(startDate);
        subscription.setEndDate(endDate);
        subscription.setDurationInMonths(months);
        subscription.setActive(true);

        return subscriptionRepository.save(subscription);
    }

    @Override
    public boolean isUserSubscribed(Long userId) {
        return subscriptionRepository.findActiveSubscription(userId, LocalDate.now()) != null;
    }

    @Override
    public void deactivateExpiredSubscriptions() {
        subscriptionRepository.deactivateExpired(LocalDate.now());
    }
}
