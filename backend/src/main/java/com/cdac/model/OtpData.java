package com.cdac.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OtpData {
	
	private String otp;
	
	private long expiresAt;
}
