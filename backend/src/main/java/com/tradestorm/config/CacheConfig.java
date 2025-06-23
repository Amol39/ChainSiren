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
                "allCryptos", "cryptoById", "cryptoBySymbol", "topGainers",
                "topLosers", "mostActive", "newlyListed", "volumeSummary","topVolume", "marketCap"
        );
        cacheManager.setCaffeine(caffeineCacheBuilder());
        return cacheManager;
    }

    private Caffeine<Object, Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
                .expireAfterWrite(120, TimeUnit.SECONDS) // Cache TTL = 120 seconds
                .maximumSize(2000); // Optional: prevent memory overuse
    }
}
