package com.tradestorm.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CryptoDTO {

    @Schema(example = "bitcoin")
    private String id;

    @Schema(example = "BTC")
    private String symbol;

    @Schema(example = "Bitcoin")
    private String name;

    @Schema(example = "https://assets.coingecko.com/coins/images/1/large/bitcoin.png")
    private String image;

    @JsonProperty("current_price")
    @Schema(example = "47000.75")
    private BigDecimal currentPrice;

    @JsonProperty("market_cap")
    @Schema(example = "850000000000")
    private BigDecimal marketCap;

    @JsonProperty("market_cap_rank")
    @Schema(example = "1")
    private int marketCapRank;

    @JsonProperty("total_volume")
    @Schema(example = "35000000000")
    private BigDecimal totalVolume;

    @JsonProperty("price_change_percentage_24h")
    @Schema(example = "-0.82")
    private double priceChangePercentage24h;

    @JsonProperty("last_updated")
    @Schema(example = "2025-06-10T18:30:00Z")
    private String lastUpdated;
}
