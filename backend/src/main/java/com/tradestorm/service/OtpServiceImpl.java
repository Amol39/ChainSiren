package com.tradestorm.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.cdac.model.OtpData;
import com.tradestorm.config.TwilioConfig;
import com.twilio.rest.verify.v2.service.VerificationCheck;

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
	private final TwilioConfig twilioConfig;
	private final long OTP_EXPIRATION_MILLIS = 10 * 60 * 1000; // 10 mins

	@Override
	public void sendOtp(String identifier) {
		String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
		long expiresAt = System.currentTimeMillis() + OTP_EXPIRATION_MILLIS;

		otpStorage.put(identifier, new OtpData(otp, expiresAt));

		if (identifier.contains("@")) {
			// Send Email
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(identifier);
			message.setSubject("Your ChainSiren Verification Code");
			message.setText("Your verification code is: " + otp + "\nThis code is valid for 10 minutes.");
			mailSender.send(message);
		} else {
			// Send SMS via Twilio
			String phoneWithCountryCode = "+91" + identifier;
			com.twilio.rest.verify.v2.service.Verification
			.creator(twilioConfig.getVerifyServiceSid(), phoneWithCountryCode, "sms").create();

		}
	}

	@Override
	public boolean verifyOtp(String identifier, String enteredOtp) {
		if (identifier.contains("@")) {
			// Email
			OtpData otpData = otpStorage.get(identifier);
			if (otpData == null)
				return false;

			if (System.currentTimeMillis() > otpData.getExpiresAt()) {
				otpStorage.remove(identifier);
				return false;
			}

			if (otpData.getOtp().equals(enteredOtp)) {
				otpStorage.remove(identifier);
				return true;
			}

			return false;
		} else {
			// Phone - Twilio Verify
			try {
				VerificationCheck verificationCheck = VerificationCheck.creator(twilioConfig.getVerifyServiceSid())
						.setTo("+91" + identifier).setCode(enteredOtp).create();

				return "approved".equalsIgnoreCase(verificationCheck.getStatus());
			} catch (Exception e) {
				return false;
			}
		}
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
