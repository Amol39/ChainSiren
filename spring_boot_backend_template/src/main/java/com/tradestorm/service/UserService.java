// UserService.java
package com.tradestorm.service;

import com.tradestorm.dto.UserDTO;
import com.tradestorm.dto.UserReqDTO;

import java.util.List;

public interface UserService {
    UserDTO registerUser(UserReqDTO userDTO);
    List<UserDTO> getAllUsers();
    UserDTO getUserById(Long userId);
}
