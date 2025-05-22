package com.cdac.model;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cryptocurrencies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cryptocurrency {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cryptoId;

	private String symbol;
	private String name;
	private BigDecimal price;
	private LocalDateTime lastUpdated;

	@OneToMany(mappedBy = "cryptocurrency", cascade = CascadeType.ALL)
	private List<Subscription> subscriptions;

	@OneToMany(mappedBy = "cryptocurrency", cascade = CascadeType.ALL)
	private List<Notification> notifications;
}
