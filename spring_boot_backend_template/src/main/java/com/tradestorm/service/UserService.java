// UserService.java
package com.tradestorm.service;

import com.tradestorm.dto.UserDTO;
import com.tradestorm.dto.UserReqDTO;

import java.util.List;

public interface UserService {
    UserDTO registerUser(UserReqDTO userDTO); // user sign in
    List<UserDTO> getAllUsers(); // admin operations
    UserDTO getUserById(Long userId); // notificatio or subscription / scheduler
}
