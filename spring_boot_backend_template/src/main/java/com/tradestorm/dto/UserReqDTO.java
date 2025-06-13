package com.tradestorm.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Schema(description = "Request payload to register a new user")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserReqDTO {

    @Schema(description = "Full name of the user", example = "Alice Johnson")
    private String name;

    @Schema(description = "Email address of the user", example = "alice@example.com")
    private String email;

    @Schema(description = "Phone number of the user", example = "+1234567890")
    private String phone;

    @Schema(description = "Password for the account", example = "P@ssw0rd123")
    private String password;
}
