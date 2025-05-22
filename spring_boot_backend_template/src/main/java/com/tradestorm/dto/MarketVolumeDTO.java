package com.tradestorm.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MarketVolumeDTO {
	private BigDecimal totalVolume;
}
