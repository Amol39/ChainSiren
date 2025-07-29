package com.tradestorm.service;

import com.cdac.model.Alert;
import com.cdac.model.Cryptocurrency;
import com.cdac.model.Subscription;
import com.cdac.model.User;
import com.tradestorm.dto.AlertDTO;
import com.tradestorm.dto.AlertRespDTO;
import com.tradestorm.dto.UpdateAlertDTO;
import com.tradestorm.repository.AlertRepository;
import com.tradestorm.repository.CryptocurrencyRepository;
import com.tradestorm.repository.SubscriptionRepository;
import com.tradestorm.repository.UserRepository;
import jakarta.annotation.PostConstruct;
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

    @PostConstruct
    public void configureModelMapper() {
        modelMapper.typeMap(Alert.class, AlertRespDTO.class).addMappings(mapper -> {
            mapper.map(Alert::getAlertId, AlertRespDTO::setAlertId);
            mapper.map(src -> src.getUser().getUserId(), AlertRespDTO::setUserId);
            mapper.map(src -> src.getCryptocurrency().getSymbol(), AlertRespDTO::setCryptoSymbol);
            mapper.map(Alert::getAlertPrice, AlertRespDTO::setAlertPrice);
            mapper.map(Alert::getAlertType, AlertRespDTO::setAlertType);
            mapper.map(Alert::getCreatedAt, AlertRespDTO::setCreatedAt);
        });
    }

    @Override
    public AlertRespDTO createAlert(AlertDTO dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Subscription activeSub = subscriptionRepo.findActiveSubscription(user.getUserId(), LocalDate.now());
        if (activeSub == null || !activeSub.isActive()) {
            throw new RuntimeException("No active subscription. Please subscribe to create alerts.");
        }

        Cryptocurrency crypto = cryptoRepo.findBySymbolIgnoreCase(dto.getCryptoSymbol())
                .orElseGet(() -> {
                    Cryptocurrency newCrypto = new Cryptocurrency();
                    newCrypto.setSymbol(dto.getCryptoSymbol().toUpperCase());
                    newCrypto.setName(dto.getCryptoSymbol().toUpperCase());
                    newCrypto.setPrice(dto.getAlertPrice());
                    newCrypto.setLastUpdated(LocalDateTime.now());
                    return cryptoRepo.save(newCrypto);
                });

        Alert alert = new Alert();
        alert.setUser(user);
        alert.setCryptocurrency(crypto);
        alert.setAlertPrice(dto.getAlertPrice());
        alert.setAlertType(dto.getAlertType());
        alert.setCreatedAt(LocalDateTime.now());

        alert = alertRepo.save(alert);
        return modelMapper.map(alert, AlertRespDTO.class);
    }

    @Override
    public List<AlertRespDTO> getUserAlerts(Long userId) {
        return alertRepo.findByUserUserId(userId).stream()
                .map(alert -> modelMapper.map(alert, AlertRespDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<AlertRespDTO> getUserAlertsForSymbol(Long userId, String symbol) {
        return alertRepo.findByUserUserIdAndCryptocurrencySymbolIgnoreCase(userId, symbol).stream()
                .map(alert -> modelMapper.map(alert, AlertRespDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public AlertRespDTO updateAlertAndReturnResp(Long id, UpdateAlertDTO dto) {
        Alert alert = alertRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        alert.setAlertPrice(dto.getAlertPrice());
        alert.setAlertType(dto.getAlertType());

        if (dto.getCryptoSymbol() != null) {
            Cryptocurrency crypto = cryptoRepo.findBySymbolIgnoreCase(dto.getCryptoSymbol())
                    .orElseThrow(() -> new RuntimeException("Crypto not found"));
            alert.setCryptocurrency(crypto);
        }

        // createdAt remains unchanged
        alert = alertRepo.save(alert);
        return modelMapper.map(alert, AlertRespDTO.class);
    }

    @Override
    public void deleteAlert(Long id) {
        if (!alertRepo.existsById(id)) {
            throw new RuntimeException("Alert not found");
        }
        alertRepo.deleteById(id);
    }
}
