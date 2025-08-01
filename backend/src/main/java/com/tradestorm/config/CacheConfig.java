package com.tradestorm.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
            // Existing market data
            "allCryptos", "cryptoById", "cryptoBySymbol", "topGainers",
            "topLosers", "mostActive", "newlyListed", "volumeSummary", "topVolume", "marketCap",
            "otpRequestTimestamps"
        );
        cacheManager.setCaffeine(caffeineCacheBuilder());
        return cacheManager;
    }

    private Caffeine<Object, Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
                .recordStats() // ✅ Enable recording statistics to silence Micrometer warnings
                .expireAfterWrite(120, TimeUnit.SECONDS) // Cache TTL = 2 minutes
                .maximumSize(2000);
    }
}
