package com.tradestorm.service;

public interface OtpService {
	
	void sendOtp(String email);
	boolean verifyOtp(String email, String enteredOtp);
	void clearOtp(String email);
	void cleanupExpiredOtps();

}
