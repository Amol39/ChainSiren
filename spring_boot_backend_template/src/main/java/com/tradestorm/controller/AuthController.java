package com.tradestorm.controller;

import com.tradestorm.dto.LoginRequestDTO;
import com.tradestorm.dto.OtpRequestDTO;
import com.tradestorm.service.AuthService;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // 🔐 Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        return authService.login(loginRequest);
    }

    // 📧 Send OTP
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) {
        return authService.sendOtp(payload);
    }

    // ✅ Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequestDTO otpRequest) {
        return authService.verifyOtp(otpRequest);
    }

    // 🔍 Check if user exists
    @PostMapping("/check-user")
    public ResponseEntity<?> checkUser(@RequestBody Map<String, String> payload) {
        return authService.checkUserExists(payload);
    }
}
