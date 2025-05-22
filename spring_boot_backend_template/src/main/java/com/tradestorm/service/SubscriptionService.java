// SubscriptionService.java
package com.tradestorm.service;

import com.tradestorm.dto.SubscriptionDTO;
import java.util.List;

public interface SubscriptionService {
    SubscriptionDTO createSubscription(SubscriptionDTO dto);
    List<SubscriptionDTO> getUserSubscriptions(Long userId);
}
