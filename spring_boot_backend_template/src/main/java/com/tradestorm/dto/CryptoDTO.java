package com.tradestorm.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CryptoDTO {

    private String id;
    private String symbol;
    private String name;

    private String image;

    @JsonProperty("current_price")
    private BigDecimal currentPrice;

    @JsonProperty("market_cap")
    private BigDecimal marketCap;

    @JsonProperty("market_cap_rank")
    private int marketCapRank;

    @JsonProperty("total_volume")
    private BigDecimal totalVolume;

    @JsonProperty("price_change_percentage_24h")
    private double priceChangePercentage24h;

    @JsonProperty("last_updated")
    private String lastUpdated;
}
