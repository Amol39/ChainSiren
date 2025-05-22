package com.cdac.model;

import java.util.List;


import jakarta.persistence.CascadeType;
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
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	private String name;
	private String email;
	private String phone;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Subscription> subscriptions;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Notification> notifications;
}
