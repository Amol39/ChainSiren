package com.tradestorm.service;

import com.tradestorm.dto.AlertDTO;
import com.tradestorm.dto.AlertRespDTO;
import com.cdac.model.Cryptocurrency;
import com.cdac.model.Alert;
import com.cdac.model.User;
import com.cdac.model.Subscription;
import com.tradestorm.repository.CryptocurrencyRepository;
import com.tradestorm.repository.AlertRepository;
import com.tradestorm.repository.UserRepository;
import com.tradestorm.repository.SubscriptionRepository;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Getter
@Setter
public class AlertServiceImpl implements AlertService {

	private final AlertRepository alertRepo;
	private final UserRepository userRepo;
	private final CryptocurrencyRepository cryptoRepo;
	private final SubscriptionRepository subscriptionRepo;
	private final ModelMapper modelMapper;

	@Override
	public AlertRespDTO createAlert(AlertDTO dto) {
		User user = userRepo.findById(dto.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found"));

		// 🔒 Subscription check
		Subscription activeSub = subscriptionRepo.findActiveSubscription(user.getUserId(), LocalDate.now());
		if (activeSub == null || !activeSub.isActive()) {
			throw new RuntimeException("No active subscription. Please subscribe to create alerts.");
		}

		Cryptocurrency crypto = cryptoRepo.findById(dto.getCryptoId())
				.orElseThrow(() -> new RuntimeException("Crypto not found"));

		Alert alert = new Alert();
		alert.setUser(user);
		alert.setCryptocurrency(crypto);
		alert.setAlertPrice(dto.getAlertPrice());
		alert.setCreatedAt(LocalDateTime.now());

		alert = alertRepo.save(alert);
		return modelMapper.map(alert, AlertRespDTO.class);
	}

	@Override
	public List<AlertDTO> getUserAlerts(Long userId) {
		return alertRepo.findByUserUserId(userId).stream()
				.map(sub -> modelMapper.map(sub, AlertDTO.class))
				.collect(Collectors.toList());
	}

	@Override
	public AlertDTO updateAlert(Long id, AlertDTO dto) {
		Alert alert = alertRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Alert not found"));

		modelMapper.map(dto, alert);
		alert.setUser(userRepo.findById(dto.getUserId())
				.orElseThrow(() -> new RuntimeException("User not found")));
		alert.setCryptocurrency(cryptoRepo.findById(dto.getCryptoId())
				.orElseThrow(() -> new RuntimeException("Crypto not found")));

		return modelMapper.map(alertRepo.save(alert), AlertDTO.class);
	}

	@Override
	public void deleteAlert(Long id) {
		if (!alertRepo.existsById(id)) {
			throw new RuntimeException("Alert not found");
		}
		alertRepo.deleteById(id);
	}
}
