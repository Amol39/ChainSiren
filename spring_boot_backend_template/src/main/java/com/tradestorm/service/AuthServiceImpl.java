package com.tradestorm.service;

import com.tradestorm.dto.LoginRequestDTO;
import com.cdac.model.User;
import com.tradestorm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AuthServiceImpl implements AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TokenService tokenService;

	@Override
	public ResponseEntity<?> login(LoginRequestDTO loginRequest) {
		String email = loginRequest.getEmail().trim();
		String rawPassword = loginRequest.getPassword().trim();

		System.out.println("🔐 Login attempt for email: " + email);

		User user = userRepository.findByEmail(email);

		if (user == null) {
			System.out.println("❌ No user found for email: " + email);
			return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
		}

		String storedPassword = user.getPassword().trim();
		System.out.println("🔍 Comparing hashed password with entered password");

		if (!org.springframework.security.crypto.bcrypt.BCrypt.checkpw(rawPassword, storedPassword)) {
			System.out.println("❌ Password mismatch (BCrypt)");
			return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
		}

		String token = tokenService.generateToken(user);
		System.out.println("✅ Login successful");

		return ResponseEntity.ok(
				Map.of("token", token, "userId", user.getUserId(), "name", user.getName(), "email", user.getEmail()));
	}
}
