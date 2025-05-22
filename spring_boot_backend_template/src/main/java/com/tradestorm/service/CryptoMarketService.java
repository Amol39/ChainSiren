package com.tradestorm.service;

import com.tradestorm.dto.CryptoDTO;
import com.tradestorm.dto.MarketCapDTO;
import com.tradestorm.dto.MarketVolumeDTO;

import java.util.List;

public interface CryptoMarketService {

	List<CryptoDTO> getAllCryptos();

	CryptoDTO getCryptoBySymbol(String symbol);
	
	CryptoDTO getCryptoById (String id);

	List<CryptoDTO> getTopGainers();

	List<CryptoDTO> getTopLosers();

	List<CryptoDTO> getMostActive();

	List<CryptoDTO> getNewlyListedCoins();

	MarketVolumeDTO getVolumeSummary();

	MarketCapDTO getMarketCap();
}
