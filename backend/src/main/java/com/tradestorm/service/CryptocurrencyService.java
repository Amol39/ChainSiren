package com.tradestorm.service;

import com.cdac.model.Cryptocurrency;

import java.math.BigDecimal;
import java.util.List;

public interface CryptocurrencyService {

    Cryptocurrency saveOrUpdate(Cryptocurrency crypto);

    List<Cryptocurrency> getAllCryptos();

    Cryptocurrency getBySymbol(String symbol);

    void updatePrice(String symbol, BigDecimal newPrice);

    void deleteBySymbol(String symbol);
}
