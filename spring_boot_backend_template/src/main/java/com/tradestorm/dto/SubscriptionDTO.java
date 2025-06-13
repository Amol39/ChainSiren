package com.tradestorm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SubscriptionDTO {

    @Schema(example = "101")
    private Long userId;

    @Schema(example = "201")
    private Long cryptoId;

    @Schema(example = "45000.00")
    private BigDecimal alertPrice;

    @Schema(example = "2025-06-10T18:30:00.363Z")
    private LocalDateTime createdAt;
}
