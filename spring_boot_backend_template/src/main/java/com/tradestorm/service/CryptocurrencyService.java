package com.tradestorm.service;

import com.cdac.model.Cryptocurrency;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface CryptocurrencyService {

    Cryptocurrency saveOrUpdate(Cryptocurrency crypto);

    List<Cryptocurrency> getAllCryptos();

    Optional<Cryptocurrency> getBySymbol(String symbol);

    void updatePrice(String symbol, BigDecimal newPrice);

    void deleteBySymbol(String symbol);
}
