package com.tradestorm.service;

import com.tradestorm.dto.LoginRequestDTO;
import com.tradestorm.dto.OtpRequestDTO;
import com.cdac.model.User;
import com.tradestorm.repository.UserRepository;

import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

	private UserRepository userRepository;

	private OtpService otpService;

	private TokenService tokenService;

	@Override
	public ResponseEntity<?> login(LoginRequestDTO loginRequest) {
		String identifier = loginRequest.getIdentifier().trim();
		String rawPassword = loginRequest.getPassword().trim();

		User user = identifier.contains("@") ? userRepository.findByEmail(identifier)
				: userRepository.findByPhone(identifier);

		if (user == null
				|| !org.springframework.security.crypto.bcrypt.BCrypt.checkpw(rawPassword, user.getPassword().trim())) {
			return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
		}

		String token = tokenService.generateToken(user);
		return ResponseEntity.ok(
				Map.of(
						"token", token, 
						"userId", user.getUserId(),
						"name", user.getName(), 
						"email", user.getEmail(),
						"isVerified", user.isVerified()
						));
	}

	@Override
	public ResponseEntity<?> sendOtp(Map<String, String> payload) {
		String email = payload.get("email");
		if (email == null || email.trim().isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
		}

		otpService.sendOtp(email);
		return ResponseEntity.ok(Map.of("message", "OTP sent to " + email));
	}

	@Override
	public ResponseEntity<?> verifyOtp(OtpRequestDTO otpRequest) {
		boolean valid = otpService.verifyOtp(otpRequest.getEmail(), otpRequest.getOtp());
		if (valid) {
			User user = userRepository.findByEmail(otpRequest.getEmail());
		    user.setVerified(true); 
		    userRepository.save(user);
			return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
		} else {
			return ResponseEntity.status(400).body(Map.of("error", "Invalid or expired OTP"));
		}
	}

	@Override
	public ResponseEntity<?> checkUserExists(Map<String, String> payload) {
		String identifier = payload.get("email");
		String mode = payload.getOrDefault("mode", "signup"); // default = signup

		if (identifier == null || identifier.trim().isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error", "Email or phone is required"));
		}

		boolean exists = userRepository.existsByEmail(identifier) || userRepository.existsByPhone(identifier);

		if (mode.equals("signup")) {
			if (exists) {
				return ResponseEntity.status(409).body(Map.of("error", "User already exists"));
			} else {
				return ResponseEntity.ok(Map.of("message", "User is unique"));
			}
		} else if (mode.equals("login")) {
			if (exists) {
				return ResponseEntity.ok(Map.of("message", "User exists"));
			} else {
				return ResponseEntity.status(404).body(Map.of("error", "User not found"));
			}
		}

		return ResponseEntity.badRequest().body(Map.of("error", "Invalid mode"));
	}

}
