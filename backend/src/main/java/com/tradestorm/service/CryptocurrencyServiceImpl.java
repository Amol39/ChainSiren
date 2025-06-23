package com.tradestorm.service;

import com.cdac.model.Cryptocurrency;
import com.tradestorm.custome_exception.CryptoNotFoundException;
import com.tradestorm.repository.CryptocurrencyRepository;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Getter
@Setter
@AllArgsConstructor
public class CryptocurrencyServiceImpl implements CryptocurrencyService {
	
	
	private final CryptocurrencyRepository cryptocurrencyRepository;

	@Override
	public Cryptocurrency saveOrUpdate(Cryptocurrency crypto) {
		Optional<Cryptocurrency> existing = cryptocurrencyRepository.findBySymbol(crypto.getSymbol());
		if (existing.isPresent()) {
			Cryptocurrency existingCrypto = existing.get();
			existingCrypto.setPrice(crypto.getPrice());
			existingCrypto.setLastUpdated(LocalDateTime.now());
			return cryptocurrencyRepository.save(existingCrypto);
		} else {
			crypto.setLastUpdated(LocalDateTime.now());
			return cryptocurrencyRepository.save(crypto);
		}
	}

	@Override
	public List<Cryptocurrency> getAllCryptos() {
		return cryptocurrencyRepository.findAll();
	}

	@Override
	public Cryptocurrency getBySymbol(String symbol) {
	    return cryptocurrencyRepository.findBySymbol(symbol)
	        .orElseThrow(() -> new CryptoNotFoundException("Crypto not found with symbol: " + symbol));
	}


	@Override
	public void updatePrice(String symbol, BigDecimal newPrice) {
		cryptocurrencyRepository.findBySymbol(symbol).ifPresent(crypto -> {
			crypto.setPrice(newPrice);
			crypto.setLastUpdated(LocalDateTime.now());
			cryptocurrencyRepository.save(crypto);
		});
	}

	@Override
	public void deleteBySymbol(String symbol) {
		cryptocurrencyRepository.deleteBySymbol(symbol);
	}
}
