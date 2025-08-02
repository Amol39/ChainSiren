package com.tradestorm.service;

import com.cdac.model.Subscription;
import com.cdac.model.User;
import com.tradestorm.dto.SubscriptionDTO;

public interface SubscriptionService {
	
    Subscription createSubscription(Long userId, int months);
    
    boolean isUserSubscribed(Long userId);
    
    void deactivateExpiredSubscriptions();

    SubscriptionDTO getSubscriptionDetails(Long userId);

	Subscription createTrialSubscription(User user);
}
