package com.tradestorm.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cdac.model.Subscription;

import jakarta.transaction.Transactional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    @Query("SELECT s FROM Subscription s WHERE s.user.userId = :userId AND s.active = true AND :today BETWEEN s.startDate AND s.endDate")
    Subscription findActiveSubscription(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Modifying
    @Transactional
    @Query("UPDATE Subscription s SET s.active = false WHERE s.endDate < :today AND s.active = true")
    void deactivateExpired(@Param("today") LocalDate today);
    
    @Query("SELECT s FROM Subscription s WHERE s.endDate < :today AND s.active = true")
    List<Subscription> findExpiringToday(@Param("today") LocalDate today);

}
