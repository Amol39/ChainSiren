package com.tradestorm.repository;

import com.cdac.model.Cryptocurrency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CryptocurrencyRepository extends JpaRepository<Cryptocurrency, Long> {

    // 1. Find cryptocurrency by its symbol (e.g., "btc", "eth")
    Optional<Cryptocurrency> findBySymbol(String symbol);
    
    Optional<Cryptocurrency> findBySymbolIgnoreCase(String symbol);

    Optional<Cryptocurrency> findByName(String name);

    boolean existsBySymbol(String symbol);

    // 4. Custom delete by symbol (optional)
    void deleteBySymbol(String symbol);
}
