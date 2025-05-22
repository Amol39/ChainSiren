// UserService.java
package com.tradestorm.service;

import com.tradestorm.dto.UserDTO;
import java.util.List;

public interface UserService {
    UserDTO registerUser(UserDTO userDTO);
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long userId);
}
