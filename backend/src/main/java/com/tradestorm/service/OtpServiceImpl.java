package com.tradestorm.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.cdac.model.OtpData;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Service
@Getter
@Setter
@AllArgsConstructor
public class OtpServiceImpl implements OtpService {

	private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
	private final JavaMailSender mailSender;
	private final long OTP_EXPIRATION_MILLIS = 10 * 60 * 1000; // 10 mins

	@Override
	public void sendOtp(String email) {
		String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
		long expiresAt = System.currentTimeMillis() + OTP_EXPIRATION_MILLIS;

		otpStorage.put(email, new OtpData(otp, expiresAt));

		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(email);
		message.setSubject("Your ChainSiren Verification Code");
		message.setText("Your verification code is: " + otp + "\nThis code is valid for 10 minutes.");
		mailSender.send(message);
	}

	@Override
	public boolean verifyOtp(String email, String enteredOtp) {
		OtpData otpData = otpStorage.get(email);
		if (otpData == null)
			return false;

		if (System.currentTimeMillis() > otpData.getExpiresAt()) {
			otpStorage.remove(email); // remove expired
			return false;
		}

		if (otpData.getOtp().equals(enteredOtp)) {
			otpStorage.remove(email); // make OTP single-use
			return true;
		}

		return false; // fallback if OTP doesn't match
	}

	@Override
	public void clearOtp(String email) {
		otpStorage.remove(email);
	}

	@Override
	public void cleanupExpiredOtps() {
		long now = System.currentTimeMillis();
		otpStorage.entrySet().removeIf(entry -> entry.getValue().getExpiresAt() < now);
	}

}
