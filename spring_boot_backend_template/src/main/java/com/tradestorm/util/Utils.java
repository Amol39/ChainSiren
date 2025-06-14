package com.tradestorm.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class Utils {

	public static final String API_BASE = "https://api.coingecko.com/api/v3/";

	public static String calculateSignature(String payload, String secret) throws Exception {
		Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
		SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		sha256_HMAC.init(secret_key);

		byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
		return new String(Base64.getEncoder().encode(hash));
	}
}
