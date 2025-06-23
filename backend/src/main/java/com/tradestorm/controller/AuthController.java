package com.tradestorm.controller;

import com.tradestorm.dto.LoginRequestDTO;
import com.tradestorm.dto.OtpRequestDTO;
import com.tradestorm.service.AuthService;
import com.tradestorm.service.OtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@Autowired
	private OtpService otpService;

	// 🔐 Login with email & password
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
		return authService.login(loginRequest);
	}

	// 📧 Send OTP to email
	@PostMapping("/send-otp")
	public ResponseEntity<?> sendOtp(@RequestBody OtpRequestDTO request) {
		String email = request.getEmail();
		if (email == null || email.isBlank()) {
			return ResponseEntity.badRequest().body("Email is required");
		}
		otpService.sendOtp(email);
		return ResponseEntity.ok("OTP sent to " + email);
	}

	// ✅ Verify OTP
	@PostMapping("/verify-otp")
	public ResponseEntity<?> verifyOtp(@RequestBody OtpRequestDTO otpRequest) {
		boolean valid = otpService.verifyOtp(otpRequest.getEmail(), otpRequest.getOtp());
		if (valid) {
			return ResponseEntity.ok("OTP verified successfully");
		} else {
			return ResponseEntity.status(400).body("Invalid or expired OTP");
		}
	}
}
