// SubscriptionService.java
package com.tradestorm.service;

import com.tradestorm.dto.SubscriptionDTO;
import com.tradestorm.dto.SubscriptionRespDTO;

import java.util.List;

public interface SubscriptionService {
	SubscriptionRespDTO createSubscription(SubscriptionDTO dto);
    List<SubscriptionDTO> getUserSubscriptions(Long userId);
    SubscriptionDTO updateSubscription(Long id, SubscriptionDTO dto);
    void deleteSubscription(Long id);
}
