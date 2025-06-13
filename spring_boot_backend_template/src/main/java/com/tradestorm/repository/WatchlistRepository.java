package com.tradestorm.repository;

import com.cdac.model.User;
import com.cdac.model.Watchlist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUser(User user);
    Optional<Watchlist> findByUserAndCryptoSymbol(User user, String cryptoSymbol);
    boolean existsByUserAndCryptoSymbol(User user, String cryptoSymbol);
}
