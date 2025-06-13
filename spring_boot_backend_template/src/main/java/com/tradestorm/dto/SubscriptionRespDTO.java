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
public class SubscriptionRespDTO {

    @Schema(example = "301", description = "Unique ID of the subscription")
    private Long subId;

    @Schema(example = "101", description = "User ID associated with the subscription")
    private Long userId;

    @Schema(example = "201", description = "Cryptocurrency ID being monitored")
    private Long cryptoId;

    @Schema(example = "45000.00", description = "Target alert price set by the user")
    private BigDecimal alertPrice;

    @Schema(example = "2025-06-10T18:30:00.363Z", description = "Timestamp when the subscription was created")
    private LocalDateTime createdAt;
}
