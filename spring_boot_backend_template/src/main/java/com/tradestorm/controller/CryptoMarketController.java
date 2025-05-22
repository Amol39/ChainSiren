package com.tradestorm.controller;

import com.tradestorm.service.CryptoMarketServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/market")
public class CryptoMarketController {

    @Autowired
    private CryptoMarketServiceImpl marketService;

 // Fetch all cryptocurrencies
    @GetMapping("/all")
    public ResponseEntity<?> getAllCryptos() {
        return ResponseEntity.ok(marketService.getAllCryptos()) ;
    }
    
    @GetMapping("/api/market/id/{id}")
    public ResponseEntity<?> getCryptoById(@PathVariable String id) {
        return ResponseEntity.ok(marketService.getCryptoById(id)) ;
    }


    // Find by symbol
    @GetMapping("/{symbol}")
    public ResponseEntity<?> getCryptoBySymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(marketService.getCryptoBySymbol(symbol));
    }
    
    
    @GetMapping("/top-gainers")
    public ResponseEntity<?> getTopGainers() {
        return ResponseEntity.ok(marketService.getTopGainers());
    }

    @GetMapping("/top-losers")
    public ResponseEntity<?> getTopLosers() {
        return ResponseEntity.ok(marketService.getTopLosers());
    }

    @GetMapping("/most-active")
    public ResponseEntity<?> getMostActive() {
        return ResponseEntity.ok(marketService.getMostActive()) ;
    }

    @GetMapping("/new")
    public ResponseEntity<?> getNewlyListedCoins() {
        return ResponseEntity.ok(marketService.getNewlyListedCoins()) ;
    }

    @GetMapping("/volume-summary")
    public ResponseEntity<?> getVolumeSummary() {
        return ResponseEntity.ok(marketService.getVolumeSummary()) ;
    }

    @GetMapping("/market-cap")
    public ResponseEntity<?> getMarketCap() {
        return ResponseEntity.ok(marketService.getMarketCap());
    }
}
