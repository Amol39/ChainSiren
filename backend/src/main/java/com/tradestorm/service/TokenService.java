package com.tradestorm.service;

import com.cdac.model.User;

public interface TokenService {
    String generateToken(User user);
}
