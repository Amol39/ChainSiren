package com.tradestorm.config;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class TwilioInitializer {

	private final TwilioConfig twilioConfig;

	@PostConstruct
	public void initTwilio() {
		System.out.println("🔐 Twilio SID: " + twilioConfig.getAccountSid());
		System.out.println("🔐 Twilio Token: " + twilioConfig.getAuthToken());
		System.out.println("🔐 Twilio Verify SID: " + twilioConfig.getVerifyServiceSid());

		Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
	}

}
