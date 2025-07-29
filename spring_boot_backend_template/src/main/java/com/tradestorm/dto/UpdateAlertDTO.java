package com.tradestorm.dto;

import java.math.BigDecimal;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdateAlertDTO {

    @Schema(description = "Updated alert price", example = "3.5")
    private BigDecimal alertPrice;

    @Schema(description = "Type of alert, e.g. 'ABOVE' or 'BELOW'", example = "ABOVE")
    private String alertType;

    @Schema(description = "Updated cryptocurrency symbol", example = "XRP")
    private String cryptoSymbol; 
}
