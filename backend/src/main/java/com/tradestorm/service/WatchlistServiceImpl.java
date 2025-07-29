package com.tradestorm.service;

import com.cdac.model.User;
import com.cdac.model.Watchlist;
import com.tradestorm.repository.UserRepository;
import com.tradestorm.repository.WatchlistRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WatchlistServiceImpl implements WatchlistService {

	private final WatchlistRepository watchlistRepository;
	private final UserRepository userRepository;

	@Override
	public String addToWatchlist(Long userId, String cryptoSymbol) {
		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

		boolean alreadyExists = watchlistRepository.existsByUserAndCryptoSymbol(user, cryptoSymbol);
		if (alreadyExists) {
			return "Already in watchlist";
		}

		Watchlist entry = new Watchlist();
		entry.setUser(user);
		entry.setCryptoSymbol(cryptoSymbol);
		watchlistRepository.save(entry);

		return "Added to watchlist";
	}

	@Override
	public void removeFromWatchlist(Long userId, String cryptoSymbol) {
		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

		Watchlist entry = watchlistRepository.findByUserAndCryptoSymbol(user, cryptoSymbol)
				.orElseThrow(() -> new IllegalArgumentException("Watchlist entry not found"));

		watchlistRepository.delete(entry);
	}

	@Override
	public List<String> getWatchlist(Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));

		return watchlistRepository.findByUser(user).stream().map(Watchlist::getCryptoSymbol)
				.collect(Collectors.toList());
	}

	@Override
	public boolean isCoinInWatchlist(Long userId, String symbol) {
	    User user = userRepository.findById(userId)
	        .orElseThrow(() -> new RuntimeException("User not found"));

	    return watchlistRepository.existsByUserAndCryptoSymbol(user, symbol);
	}


}
