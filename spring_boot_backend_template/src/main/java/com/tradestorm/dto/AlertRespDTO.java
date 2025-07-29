package com.tradestorm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AlertRespDTO {

    @Schema(example = "301", description = "Unique ID of the alert")
    private Long alertId;

    @Schema(example = "101", description = "User ID associated with the alert")
    private Long userId;

    @Schema(example = "BTC", description = "Symbol of the cryptocurrency")
    private String cryptoSymbol;

    @Schema(example = "45000.00", description = "Target price set by the user")
    private BigDecimal alertPrice;

    @Schema(example = "above", description = "Type of alert, e.g., 'above' or 'below'")
    private String alertType;

    @Schema(example = "2025-06-10T18:30:00.363Z", description = "When the alert was created")
    private LocalDateTime createdAt;
}
