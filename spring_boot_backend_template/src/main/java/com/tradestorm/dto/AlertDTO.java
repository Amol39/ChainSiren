package com.tradestorm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AlertDTO {

    @Schema(example = "101")
    private Long userId;

    @Schema(example = "BTC", description = "Symbol of the cryptocurrency, e.g., BTC, ETH")
    private String cryptoSymbol;

    @Schema(example = "45000.00", description = "Target price to trigger alert")
    private BigDecimal alertPrice;

    @Schema(example = "above", description = "Alert type: 'above' or 'below'")
    private String alertType;

    @Schema(example = "2025-06-10T18:30:00.363Z")
    private LocalDateTime createdAt;
}
