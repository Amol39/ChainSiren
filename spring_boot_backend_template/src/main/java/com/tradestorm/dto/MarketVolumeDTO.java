package com.tradestorm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MarketVolumeDTO {

    @Schema(example = "65000000.00")
    private BigDecimal totalVolume;
}
