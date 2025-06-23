package com.tradestorm.scheduler;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CacheEvictScheduler {

    @Scheduled(fixedRate = 60000) // every 60 seconds
    @CacheEvict(value = {
            "allCryptos", "cryptoById", "cryptoBySymbol", "topGainers",
            "topLosers", "mostActive", "newlyListed", "volumeSummary", "marketCap"
    }, allEntries = true)
    public void clearAllCaches() {
        System.out.println("✅ Cleared all crypto market caches");
    }
}
