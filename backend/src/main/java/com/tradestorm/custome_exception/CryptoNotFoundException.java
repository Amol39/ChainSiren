package com.tradestorm.custome_exception;

@SuppressWarnings("serial")
public class CryptoNotFoundException extends RuntimeException {

	public CryptoNotFoundException(String message) {
		super(message);
	}
}
