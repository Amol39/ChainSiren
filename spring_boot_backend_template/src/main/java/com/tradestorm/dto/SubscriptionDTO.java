// SubscriptionDTO.java
package com.tradestorm.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class SubscriptionDTO {
    private Long subId;
    private Long userId;
    private Long cryptoId;
    private BigDecimal alertPrice;
    private LocalDateTime createdAt;
}
