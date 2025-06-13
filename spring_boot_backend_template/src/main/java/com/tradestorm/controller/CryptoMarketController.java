package com.tradestorm.controller;

import com.tradestorm.service.CryptoMarketServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/market")
public class CryptoMarketController {

    @Autowired
    private CryptoMarketServiceImpl marketService;

    @Operation(summary = "Fetch all market cryptocurrencies")
    @GetMapping("/all")
    public ResponseEntity<?> getAllCryptos() {
        return ResponseEntity.ok(marketService.getAllCryptos());
    }

    @Operation(summary = "Get crypto by ID")
    @GetMapping("/id/{id}")
    public ResponseEntity<?> getCryptoById(@PathVariable String id) {
        return ResponseEntity.ok(marketService.getCryptoById(id));
    }

    @Operation(summary = "Get crypto by symbol")
    @GetMapping("/{symbol}")
    public ResponseEntity<?> getCryptoBySymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(marketService.getCryptoBySymbol(symbol));
    }

    @Operation(summary = "Get top gaining cryptocurrencies")
    @GetMapping("/top-gainers")
    public ResponseEntity<?> getTopGainers() {
        return ResponseEntity.ok(marketService.getTopGainers());
    }

    @Operation(summary = "Get top losing cryptocurrencies")
    @GetMapping("/top-losers")
    public ResponseEntity<?> getTopLosers() {
        return ResponseEntity.ok(marketService.getTopLosers());
    }

    @Operation(summary = "Get most active cryptocurrencies")
    @GetMapping("/most-active")
    public ResponseEntity<?> getMostActive() {
        return ResponseEntity.ok(marketService.getMostActive());
    }

    @Operation(summary = "Get newly listed coins")
    @GetMapping("/new")
    public ResponseEntity<?> getNewlyListedCoins() {
        return ResponseEntity.ok(marketService.getNewlyListedCoins());
    }

    @Operation(summary = "Get 24h volume summary")
    @GetMapping("/volume-summary")
    public ResponseEntity<?> getVolumeSummary() {
        return ResponseEntity.ok(marketService.getVolumeSummary());
    }

    @Operation(summary = "Get total market cap")
    @GetMapping("/market-cap")
    public ResponseEntity<?> getMarketCap() {
        return ResponseEntity.ok(marketService.getMarketCap());
    }
}
