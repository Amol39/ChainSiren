package com.tradestorm.controller;

import com.cdac.model.Cryptocurrency;
import com.tradestorm.service.CryptocurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/cryptos")
public class CryptocurrencyController {

    @Autowired
    private CryptocurrencyService cryptoService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(cryptoService.getAllCryptos() ) ;
    }

    @PostMapping
    public ResponseEntity<?> addOrUpdate(@RequestBody Cryptocurrency crypto) {
        return ResponseEntity.ok(cryptoService.saveOrUpdate(crypto)) ;
    }

    @PutMapping("/{symbol}/price")
    public void updatePrice(@PathVariable String symbol, @RequestParam BigDecimal price) {
        cryptoService.updatePrice(symbol, price);
    }

    @DeleteMapping("/{symbol}")
    public void deleteCrypto(@PathVariable String symbol) {
        cryptoService.deleteBySymbol(symbol);
    }
    @GetMapping("/{symbol}")
    public ResponseEntity<Cryptocurrency> getBySymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(cryptoService.getBySymbol(symbol));
    }

}
