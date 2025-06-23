package com.tradestorm.service;

import com.cdac.model.User;
import com.tradestorm.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TokenServiceImpl implements TokenService {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getEmail());
    }
}
