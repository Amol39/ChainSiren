// UserServiceImpl.java
package com.tradestorm.service;

import com.tradestorm.dto.UserDTO;
import com.cdac.model.*;
import com.tradestorm.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserDTO registerUser(UserDTO userDTO) {
        if (userRepo.existsByEmail(userDTO.getEmail()))
            throw new RuntimeException("User already exists");

        User user = modelMapper.map(userDTO, User.class);
        user = userRepo.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepo.findAll()
                .stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return modelMapper.map(user, UserDTO.class);
    }
}
