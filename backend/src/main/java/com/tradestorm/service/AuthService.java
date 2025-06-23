package com.tradestorm.service;

import com.tradestorm.dto.LoginRequestDTO;
import org.springframework.http.ResponseEntity;

public interface AuthService {
	
    ResponseEntity<?> login(LoginRequestDTO loginRequest);
}
