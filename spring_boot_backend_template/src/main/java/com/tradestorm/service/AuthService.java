package com.tradestorm.service;

import com.tradestorm.dto.LoginRequestDTO;
import com.tradestorm.dto.OtpRequestDTO;

import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> login(LoginRequestDTO loginRequest);
    ResponseEntity<?> sendOtp(Map<String, String> payload);
    ResponseEntity<?> verifyOtp(OtpRequestDTO otpRequest);
    ResponseEntity<?> checkUserExists(Map<String, String> payload);
}
