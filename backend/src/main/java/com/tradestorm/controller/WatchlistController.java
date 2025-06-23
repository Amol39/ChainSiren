package com.tradestorm.controller;

import com.tradestorm.service.WatchlistService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
public class WatchlistController {

    private final WatchlistService watchlistService;

    @Operation(summary = "Add a cryptocurrency to user's watchlist")
    @PostMapping("/add")
    public ResponseEntity<?> addToWatchlist(@RequestParam Long userId, @RequestParam String symbol) {
        return ResponseEntity.ok(watchlistService.addToWatchlist(userId, symbol));
    }

    @Operation(summary = "Remove a cryptocurrency from watchlist")
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromWatchlist(@RequestParam Long userId, @RequestParam String symbol) {
        watchlistService.removeFromWatchlist(userId, symbol);
        return ResponseEntity.ok("Removed from watchlist");
    }

    @Operation(summary = "Get user's watchlist")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<String>> getWatchlist(@PathVariable Long userId) {
        return ResponseEntity.ok(watchlistService.getWatchlist(userId));
    }
}
