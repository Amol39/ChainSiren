// UserServiceImpl.java
package com.tradestorm.service;

import com.tradestorm.dto.UserDTO;
import com.tradestorm.dto.UserReqDTO;
import com.tradestorm.dto.UserUpdateDTO;
import com.cdac.model.*;
import com.tradestorm.repository.UserRepository;

import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

	private UserRepository userRepo;

	private ModelMapper modelMapper;

	private final PasswordEncoder passwordEncoder;

	@Override
	public UserDTO registerUser(UserReqDTO userDTO) {
		if (userRepo.existsByEmail(userDTO.getEmail()))
			throw new RuntimeException("User already exists");

		User user = modelMapper.map(userDTO, User.class);
		user = userRepo.save(user);
		return modelMapper.map(user, UserDTO.class);
	}

	@Override
	public List<UserDTO> getAllUsers() {
		return userRepo.findAll().stream().map(user -> modelMapper.map(user, UserDTO.class))
				.collect(Collectors.toList());
	}

	@Override
	public UserDTO getUserById(Long userId) {
		User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
		return modelMapper.map(user, UserDTO.class);
	}

	@Override
	public UserDTO updateUser(Long id, UserUpdateDTO updateDTO) {
		User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		if (updateDTO.getName() != null)
			user.setName(updateDTO.getName());
		if (updateDTO.getEmail() != null)
			user.setEmail(updateDTO.getEmail());
		if (updateDTO.getPassword() != null) {
			String hashed = passwordEncoder.encode(updateDTO.getPassword());
			user.setPassword(hashed);
		}
		if (updateDTO.getNotificationPreference() != null) {
			user.setNotificationPreference(updateDTO.getNotificationPreference());
		}

		User updated = userRepo.save(user);
		return modelMapper.map(updated, UserDTO.class);
	}

}
