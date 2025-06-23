package com.tradestorm.service;

import com.cdac.model.Subscription;

public interface SubscriptionService {
	
    Subscription createSubscription(Long userId, int months);
    
    boolean isUserSubscribed(Long userId);
    
    void deactivateExpiredSubscriptions();
}
