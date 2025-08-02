package com.tradestorm.service;

import com.cdac.model.Subscription;

import com.cdac.model.User;
import com.tradestorm.dto.SubscriptionDTO;
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
		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

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
	public Subscription createTrialSubscription(User user) {
		LocalDate startDate = LocalDate.now();
		LocalDate endDate = startDate.plusDays(7);

		Subscription subscription = new Subscription();
		subscription.setUser(user);
		subscription.setStartDate(startDate);
		subscription.setEndDate(endDate);
		subscription.setDurationInMonths(0); // Because it's a 7-day trial
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

	@Override
	public SubscriptionDTO getSubscriptionDetails(Long userId) {
	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    SubscriptionDTO dto = new SubscriptionDTO();

	    if (user.getSubscriptionType() != null) {
	        dto.setSubscriptionType(user.getSubscriptionType().name());
	    } else {
	        dto.setSubscriptionType("FREE");
	    }

	    dto.setStartDate(user.getSubscriptionStart());
	    dto.setEndDate(user.getSubscriptionEnd());

	    if (user.getSubscriptionStart() != null && user.getSubscriptionEnd() != null) {
	        long months = java.time.temporal.ChronoUnit.MONTHS.between(
	                user.getSubscriptionStart(), user.getSubscriptionEnd()
	        );
	        dto.setDurationInMonths((int) months);
	    } else {
	        dto.setDurationInMonths(0); 
	    }

	    dto.setActive(user.getSubscriptionEnd() != null &&
	                  user.getSubscriptionEnd().isAfter(LocalDate.now()));

	    return dto;
	}


}
