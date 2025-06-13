// UserService.java
package com.tradestorm.service;

import com.tradestorm.dto.UserDTO;
import com.tradestorm.dto.UserReqDTO;
import com.tradestorm.dto.UserUpdateDTO;

import java.util.List;

public interface UserService {
    UserDTO registerUser(UserReqDTO userDTO); // user sign in
    List<UserDTO> getAllUsers(); // admin operations
    UserDTO getUserById(Long userId); // notificatio or subscription / scheduler
    UserDTO updateUser(Long id, UserUpdateDTO updateDTO);
}
