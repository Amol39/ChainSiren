// SubscriptionRepository.java
package com.tradestorm.repository;

import com.cdac.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    
	List<Alert> findByUserUserId(Long userId);
}
