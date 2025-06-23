package com.tradestorm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.tradestorm.dto.CryptoDTO;
import com.tradestorm.dto.MarketCapDTO;
import com.tradestorm.dto.MarketVolumeDTO;
import com.tradestorm.util.Utils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static com.tradestorm.util.Utils.API_BASE;

@Service
@Getter
@Setter
@AllArgsConstructor
public class CryptoMarketServiceImpl implements CryptoMarketService {

    private final RestTemplate restTemplate;

    @Override
    @Cacheable("allCryptos")
    public List<CryptoDTO> getAllCryptos() {
        return fetchMarketData();
    }

    @Override
    @Cacheable(value = "cryptoById", key = "#id")
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
    @Cacheable(value = "cryptoBySymbol", key = "#symbol")
    public CryptoDTO getCryptoBySymbol(String symbol) {
        return getAllCryptos().stream()
                .filter(c -> c.getSymbol().equalsIgnoreCase(symbol))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cryptocurrency not found with symbol: " + symbol));
    }

    @Override
    @Cacheable("topGainers")
    public List<CryptoDTO> getTopGainers() {
        return getAllCryptos().stream()
                .sorted(Comparator.comparing(CryptoDTO::getPriceChangePercentage24h).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable("topLosers")
    public List<CryptoDTO> getTopLosers() {
        return getAllCryptos().stream()
                .sorted(Comparator.comparing(CryptoDTO::getPriceChangePercentage24h))
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable("mostActive")
    public List<CryptoDTO> getMostActive() {
        return getAllCryptos().stream()
                .sorted(Comparator.comparing(CryptoDTO::getTotalVolume).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable("newlyListed")
    public List<CryptoDTO> getNewlyListedCoins() {
        String url = API_BASE + "coins/list";
        CryptoDTO[] coins = restTemplate.getForObject(url, CryptoDTO[].class);
        return Arrays.stream(coins).limit(10).collect(Collectors.toList());
    }

    @Override
    @Cacheable("marketCap")
    public MarketCapDTO getMarketCap() {
        String url = API_BASE + "global";
        JsonNode root = restTemplate.getForObject(url, JsonNode.class);
        BigDecimal usdMarketCap = root.path("data").path("total_market_cap").path("usd").decimalValue();
        return new MarketCapDTO(usdMarketCap);
    }

    @Override
    @Cacheable("volumeSummary")
    public MarketVolumeDTO getVolumeSummary() {
        String url = API_BASE + "global";
        JsonNode root = restTemplate.getForObject(url, JsonNode.class);
        BigDecimal usdVolume = root.path("data").path("total_volume").path("usd").decimalValue();
        return new MarketVolumeDTO(usdVolume);
    }

    // ✅ NEW: Get top volume cryptocurrencies
    @Override
    @Cacheable("topVolume")
    public List<CryptoDTO> getTopVolume() {
        String url = UriComponentsBuilder.fromUriString(Utils.API_BASE + "coins/markets")
                .queryParam("vs_currency", "usd")
                .queryParam("order", "volume_desc")
                .queryParam("per_page", 10)
                .queryParam("page", 1)
                .queryParam("sparkline", false)
                .build()
                .toUriString();

        CryptoDTO[] data = restTemplate.getForObject(url, CryptoDTO[].class);
        return Arrays.asList(data);
    }

    private List<CryptoDTO> fetchMarketData() {
        String url = API_BASE + "coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
        CryptoDTO[] data = restTemplate.getForObject(url, CryptoDTO[].class);
        return Arrays.asList(data);
    }
}
