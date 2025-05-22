// UserDTO.java
package com.tradestorm.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String name;
    private String email;
    private String phone;
}
