package com.tradestorm.service;

import java.util.List;

public interface WatchlistService {
    String addToWatchlist(Long userId, String cryptoSymbol);
    void removeFromWatchlist(Long userId, String cryptoSymbol);
    List<String> getWatchlist(Long userId);
}
