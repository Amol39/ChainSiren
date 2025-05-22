// NotificationDTO.java
package com.tradestorm.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long notifId;
    private Long userId;
    private Long cryptoId;
    private String message;
    private LocalDateTime timestamp;
}
