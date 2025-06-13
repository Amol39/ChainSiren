package com.cdac.model;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(hidden = true)
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	private String name;
	private String email;
	private String phone;
	private String password;
	@Column(name = "notification_preference")
	private String notificationPreference;


	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Alert> alerts;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Notification> notifications;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Watchlist> watchlist;

}
