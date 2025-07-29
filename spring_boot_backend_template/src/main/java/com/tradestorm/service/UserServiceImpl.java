package com.tradestorm.service;

import com.cdac.model.Subscription;
import com.cdac.model.User;
import com.tradestorm.dto.UserDTO;
import com.tradestorm.dto.UserReqDTO;
import com.tradestorm.dto.UserUpdateDTO;
import com.tradestorm.repository.SubscriptionRepository;
import com.tradestorm.repository.UserRepository;

import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepo;
	private final SubscriptionRepository subscriptionRepo;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public UserDTO registerUser(UserReqDTO userDTO) {
		if (userRepo.existsByEmail(userDTO.getEmail()))
			throw new RuntimeException("User already exists");

		User user = modelMapper.map(userDTO, User.class);
		user.setPassword(passwordEncoder.encode(userDTO.getPassword())); //  Encrypt password
		user = userRepo.save(user);

		//  Add 7-day free trial subscription
		Subscription trial = new Subscription();
		trial.setUser(user);
		trial.setStartDate(LocalDate.now());
		trial.setEndDate(LocalDate.now().plusDays(7));
		trial.setDurationInMonths(0);
		trial.setActive(true);
		subscriptionRepo.save(trial);

		return modelMapper.map(user, UserDTO.class);
	}

	@Override
	public List<UserDTO> getAllUsers() {
	    List<User> users = userRepo.findAll();
	    List<UserDTO> userDTOs = new ArrayList<>();

	    for (User user : users) {
	        UserDTO dto = new UserDTO();
	        dto.setUserId(user.getUserId());
	        dto.setName(user.getName());
	        dto.setEmail(user.getEmail());
	        dto.setPhone(user.getPhone());
	        userDTOs.add(dto);
	    }

	    return userDTOs;
	}


	@Override
	public UserDTO getUserById(Long userId) {
	    User user = userRepo.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    UserDTO dto = new UserDTO();
	    dto.setUserId(user.getUserId());
	    dto.setName(user.getName());
	    dto.setEmail(user.getEmail());
	    dto.setPhone(user.getPhone());

	    return dto;
	}

	@Override
	public UserDTO updateUser(Long id, UserUpdateDTO updateDTO) {
		User user = userRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found"));

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

	@Override
	public User save(User user) {
	    return userRepo.save(user);
	}

	@Override
	public User findEntityById(Long userId) {
	    return userRepo.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));
	}

}
