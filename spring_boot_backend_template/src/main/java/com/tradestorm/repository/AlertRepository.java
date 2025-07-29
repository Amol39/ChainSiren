package com.tradestorm.repository;

import com.cdac.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    
    List<Alert> findByUserUserId(Long userId);

    // ✅ Needed for per-symbol alert lookup
    List<Alert> findByUserUserIdAndCryptocurrencySymbolIgnoreCase(Long userId, String symbol);
}
