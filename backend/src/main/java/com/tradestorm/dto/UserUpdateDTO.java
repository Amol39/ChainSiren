package com.tradestorm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Schema(description = "Payload to update user profile or notification settings")
@Data
public class UserUpdateDTO {

    @Schema(description = "Updated name of the user", example = "Bob Smith")
    private String name;

    @Schema(description = "Updated email address", example = "bobsmith@example.com")
    private String email;

    @Schema(description = "New password (will be encrypted before saving)", example = "NewP@ss1234")
    private String password;

    @Schema(description = "Notification preference", example = "EMAIL")
    private String notificationPreference;
}
