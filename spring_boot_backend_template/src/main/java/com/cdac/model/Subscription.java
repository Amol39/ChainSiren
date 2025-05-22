package com.cdac.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long subId;

	private BigDecimal alertPrice;
	private LocalDateTime createdAt;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne
	@JoinColumn(name = "crypto_id", referencedColumnName = "cryptoId", nullable = false)
	private Cryptocurrency cryptocurrency;
}
