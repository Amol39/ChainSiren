package com.tradestorm.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.cdac.model.OtpData;
import com.tradestorm.config.TwilioConfig;
import com.tradestorm.repository.UserRepository;
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
	private final CacheManager cacheManager;
	private final UserRepository userRepository;

	private final long OTP_EXPIRATION_MILLIS = 10 * 60 * 1000; // 10 minutes
	private final long OTP_RESEND_INTERVAL_MILLIS = 60 * 1000; // 60 seconds

	@Override
	public void sendOtp(String identifier) {
		Cache otpRateCache = cacheManager.getCache("otpRateLimit");
		long now = System.currentTimeMillis();

		// Rate limiting check
		Long lastSentTime = otpRateCache != null ? otpRateCache.get(identifier, Long.class) : null;
		if (lastSentTime != null && (now - lastSentTime) < OTP_RESEND_INTERVAL_MILLIS) {
			throw new RuntimeException("OTP recently sent. Please wait before requesting again.");
		}

		String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
		long expiresAt = now + OTP_EXPIRATION_MILLIS;
		otpStorage.put(identifier, new OtpData(otp, expiresAt));

		if (otpRateCache != null) {
			otpRateCache.put(identifier, now); // Save timestamp
		}

		if (identifier.contains("@")) {
			// Email OTP
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(identifier);
			message.setSubject("Your ChainSiren Verification Code");
			message.setText("Your verification code is: " + otp + "\nThis code is valid for 10 minutes.");
			mailSender.send(message);
		} else {
			// Phone OTP via Twilio
			String phoneWithCountryCode = "+91" + identifier;
			com.twilio.rest.verify.v2.service.Verification
					.creator(twilioConfig.getVerifyServiceSid(), phoneWithCountryCode, "sms").create();
		}
	}

	@Override
	public boolean verifyOtp(String identifier, String enteredOtp) {
	    if (identifier.contains("@")) {
	        // Email OTP verification
	        OtpData otpData = otpStorage.get(identifier);
	        if (otpData == null || System.currentTimeMillis() > otpData.getExpiresAt()) {
	            otpStorage.remove(identifier);
	            return false;
	        }

	        if (otpData.getOtp().equals(enteredOtp)) {
	            otpStorage.remove(identifier);

	            userRepository.findByEmail(identifier).ifPresent(user -> {
	                user.setVerified(true); // Set verified only for email
	                userRepository.save(user);
	            });

	            return true;
	        } else {
	            return false;
	        }

	    } else {
	        // Phone OTP verification via Twilio
	        try {
	            VerificationCheck verificationCheck = VerificationCheck.creator(twilioConfig.getVerifyServiceSid())
	                    .setTo("+91" + identifier)
	                    .setCode(enteredOtp)
	                    .create();

	            return "approved".equalsIgnoreCase(verificationCheck.getStatus());

	        } catch (Exception e) {
	            return false;
	        }
	    }
	}



	@Override
	public void clearOtp(String identifier) {
		otpStorage.remove(identifier);
	}

	@Override
	public void cleanupExpiredOtps() {
		long now = System.currentTimeMillis();
		otpStorage.entrySet().removeIf(entry -> entry.getValue().getExpiresAt() < now);
	}
}
