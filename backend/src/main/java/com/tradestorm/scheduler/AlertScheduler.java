package com.tradestorm.scheduler;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.cdac.model.Alert;
import com.cdac.model.Cryptocurrency;
import com.cdac.model.User;
import com.tradestorm.dto.CryptoDTO;
import com.tradestorm.repository.AlertRepository;
import com.tradestorm.service.CryptoMarketService;
import com.tradestorm.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AlertScheduler {

    private final AlertRepository alertRepository;
    private final NotificationService notificationService;
    private final CryptoMarketService marketService;

    @Scheduled(fixedRate = 60000) // Every 60 seconds
    public void checkAlerts() {
        List<Alert> alerts = alertRepository.findAll();
        List<CryptoDTO> liveCoins = marketService.getAllCryptos();

        for (Alert alert : alerts) {
            String symbol = alert.getCryptocurrency().getSymbol();
            BigDecimal alertPrice = alert.getAlertPrice();

            liveCoins.stream()
                .filter(coin -> coin.getSymbol().equalsIgnoreCase(symbol))
                .findFirst()
                .ifPresent(liveCoin -> {
                    BigDecimal livePrice = liveCoin.getCurrentPrice();

                    if (livePrice.compareTo(alertPrice) <= 0) {
                        User user = alert.getUser();

                        // ✅ Check if subscription is still valid
                        if (user.getSubscription() == null || !user.getSubscription().isActive()) {
                            return;
                        }

                        Cryptocurrency crypto = alert.getCryptocurrency();
                        String message = symbol + " dropped to $" + livePrice + ", below alert $" + alertPrice;

                        // ✅ Corrected: pass userId instead of User
                        notificationService.createNotification(message, user.getUserId(), crypto);
                    }
                });
        }
    }
}
