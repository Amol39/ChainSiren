package com.tradestorm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.tradestorm.dto.CryptoDTO;
import com.tradestorm.dto.MarketCapDTO;
import com.tradestorm.dto.MarketVolumeDTO;
import com.tradestorm.util.Utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static com.tradestorm.util.Utils.*;

@Service
@Getter
@Setter
@AllArgsConstructor
public class CryptoMarketServiceImpl implements CryptoMarketService {

	private final RestTemplate restTemplate;

	@Override
	public List<CryptoDTO> getAllCryptos() {
		// Reuse the same fetchMarketData method to return all
		return fetchMarketData();
	}

	@Override
	public CryptoDTO getCryptoById(String id) {
	    String url = UriComponentsBuilder.fromUriString(Utils.API_BASE)
	            .path("/coins/markets")
	            .queryParam("vs_currency", "usd")
	            .queryParam("ids", id.toLowerCase())
	            .build()
	            .toUriString();

	    List<CryptoDTO> cryptoList = Arrays.asList(restTemplate.getForObject(url, CryptoDTO[].class));

	    if (cryptoList.isEmpty()) {
	        throw new RuntimeException("Cryptocurrency not found with id: " + id);
	    }

	    return cryptoList.get(0);
	}

	@Override
	public CryptoDTO getCryptoBySymbol(String symbol) {
		return fetchMarketData().stream().filter(c -> c.getSymbol().equalsIgnoreCase(symbol)).findFirst()
				.orElseThrow(() -> new RuntimeException("Cryptocurrency not found with symbol: " + symbol));
	}

	@Override
	public List<CryptoDTO> getTopGainers() {
		return fetchMarketData().stream()
				.sorted(Comparator.comparing(CryptoDTO::getPriceChangePercentage24h).reversed()).limit(10)
				.collect(Collectors.toList());
	}

	@Override
	public List<CryptoDTO> getTopLosers() {
		return fetchMarketData().stream().sorted(Comparator.comparing(CryptoDTO::getPriceChangePercentage24h)).limit(10)
				.collect(Collectors.toList());
	}

	@Override
	public List<CryptoDTO> getMostActive() {
		return fetchMarketData().stream().sorted(Comparator.comparing(CryptoDTO::getTotalVolume).reversed()).limit(10)
				.collect(Collectors.toList());
	}

	@Override
	public List<CryptoDTO> getNewlyListedCoins() {
		String url = API_BASE + "coins/list";
		CryptoDTO[] coins = restTemplate.getForObject(url, CryptoDTO[].class);
		return Arrays.stream(coins).limit(10).collect(Collectors.toList());
	}

	@Override
	public MarketCapDTO getMarketCap() {
		String url = API_BASE + "global";
		JsonNode root = restTemplate.getForObject(url, JsonNode.class);

		// Navigate to data.total_market_cap.usd
		BigDecimal usdMarketCap = root.path("data").path("total_market_cap").path("usd").decimalValue();

		return new MarketCapDTO(usdMarketCap);
	}

	@Override
	public MarketVolumeDTO getVolumeSummary() {
		String url = API_BASE + "global";
		JsonNode root = restTemplate.getForObject(url, JsonNode.class);

		// Navigate to data.total_volume.usd
		BigDecimal usdVolume = root.path("data").path("total_volume").path("usd").decimalValue();

		return new MarketVolumeDTO(usdVolume);
	}

	private List<CryptoDTO> fetchMarketData() {
		String url = API_BASE
				+ "coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
		CryptoDTO[] data = restTemplate.getForObject(url, CryptoDTO[].class);
		return Arrays.asList(data);
	}

}
