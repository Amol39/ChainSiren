package com.tradestorm.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class SubscriptionDTO {
	private String subscriptionType;
	private LocalDate startDate;
	private LocalDate endDate;
	private Integer durationInMonths;
	private boolean active;

}
