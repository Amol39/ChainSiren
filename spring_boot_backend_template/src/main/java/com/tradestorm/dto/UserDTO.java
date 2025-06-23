package com.tradestorm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "User data returned in responses")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    @Schema(description = "Unique identifier of the user", example = "101")
    private Long userId;

    @Schema(description = "Full name of the user", example = "Alice Johnson")
    private String name;

    @Schema(description = "Email address of the user", example = "alice@example.com")
    private String email;

    @Schema(description = "Phone number of the user", example = "+1234567890")
    private String phone;
}
