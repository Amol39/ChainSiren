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

        for (Alert sub : alerts) {
            String symbol = sub.getCryptocurrency().getSymbol();
            BigDecimal alertPrice = sub.getAlertPrice();

            liveCoins.stream()
                .filter(coin -> coin.getSymbol().equalsIgnoreCase(symbol))
                .findFirst()
                .ifPresent(liveCoin -> {
                    BigDecimal livePrice = liveCoin.getCurrentPrice();

                    if (livePrice.compareTo(alertPrice) <= 0) {
                        User user = sub.getUser();
                        Cryptocurrency crypto = sub.getCryptocurrency();
                        String message = symbol + " dropped to $" + livePrice + ", below alert $" + alertPrice;
                        notificationService.createNotification(message, user, crypto);
                    }
                });
        }
    }
}
