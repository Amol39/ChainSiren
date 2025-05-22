// SubscriptionServiceImpl.java
package com.tradestorm.service;

import com.tradestorm.dto.SubscriptionDTO;
import com.cdac.model.Cryptocurrency;
import com.cdac.model.Subscription;
import com.cdac.model.User;
import com.tradestorm.repository.CryptocurrencyRepository;
import com.tradestorm.repository.SubscriptionRepository;
import com.tradestorm.repository.UserRepository;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Getter
@Setter
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subRepo;

    private final UserRepository userRepo;

    private final CryptocurrencyRepository cryptoRepo;

    private ModelMapper modelMapper;

    @Override
    public SubscriptionDTO createSubscription(SubscriptionDTO dto) {
        User user = userRepo.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cryptocurrency crypto = cryptoRepo.findById(dto.getCryptoId())
                .orElseThrow(() -> new RuntimeException("Crypto not found"));

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setCryptocurrency(crypto);
        subscription.setAlertPrice(dto.getAlertPrice());
        subscription.setCreatedAt(LocalDateTime.now());

        subscription = subRepo.save(subscription);
        return modelMapper.map(subscription, SubscriptionDTO.class);
    }

    @Override
    public List<SubscriptionDTO> getUserSubscriptions(Long userId) {
        return subRepo.findByUserUserId(userId)
                .stream()
                .map(sub -> modelMapper.map(sub, SubscriptionDTO.class))
                .collect(Collectors.toList());
    }
}
