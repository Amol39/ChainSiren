package com.tradestorm.controller;

import com.cdac.model.Cryptocurrency;
import com.tradestorm.service.CryptocurrencyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cryptos")
public class CryptocurrencyController {

    @Autowired
    private CryptocurrencyService cryptoService;

    @Operation(summary = "Get all cryptocurrencies")
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(cryptoService.getAllCryptos());
    }

    @Operation(summary = "Add or update a cryptocurrency")
    @PostMapping
    public ResponseEntity<?> addOrUpdate(@RequestBody Cryptocurrency crypto) {
        return ResponseEntity.ok(cryptoService.saveOrUpdate(crypto));
    }

    @Operation(summary = "Update cryptocurrency price")
    @PutMapping("/{symbol}/price")
    public void updatePrice(
            @Parameter(description = "Symbol of the cryptocurrency") @PathVariable String symbol,
            @Parameter(description = "New price value") @RequestParam BigDecimal price) {
        cryptoService.updatePrice(symbol, price);
    }

    @Operation(summary = "Delete cryptocurrency by symbol")
    @DeleteMapping("/{symbol}")
    public void deleteCrypto(@PathVariable String symbol) {
        cryptoService.deleteBySymbol(symbol);
    }

    @Operation(summary = "Get cryptocurrency by symbol")
    @GetMapping("/{symbol}")
    public ResponseEntity<Cryptocurrency> getBySymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(cryptoService.getBySymbol(symbol));
    }
}
