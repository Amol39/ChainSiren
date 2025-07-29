package com.tradestorm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {

    @Schema(example = "1")
    private Long notifId;

    @Schema(example = "101")
    private Long userId;

    @Schema(example = "201")
    private Long cryptoId;

    @Schema(example = "Price of BTC has reached your alert threshold.")
    private String message;

    @Schema(example = "2025-06-10T18:30:00.363Z")
    private LocalDateTime timestamp;

    private Boolean read;

    @Schema(example = "BTC")
    private String cryptoSymbol;
}
