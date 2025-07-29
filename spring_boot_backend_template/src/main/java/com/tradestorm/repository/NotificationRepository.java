package com.tradestorm.repository;

import com.cdac.model.Cryptocurrency;
import com.cdac.model.Notification;
import com.cdac.model.User;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserUserId(Long userId);
    List<Notification> findByUser(User user);
    List<Notification> findByCryptocurrency(Cryptocurrency cryptocurrency);

    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.cryptocurrency = :crypto AND n.message = :message")
    Optional<Notification> findDuplicate(@Param("user") User user,
                                         @Param("crypto") Cryptocurrency crypto,
                                         @Param("message") String message);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.userId = :userId")
    int countUnreadByUserId(@Param("userId") Long userId);
    
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true WHERE n.user.userId = :userId")
    void markAllAsReadByUserId(Long userId);
    
    boolean existsByUserAndCryptocurrencyAndMessageAndTimestampAfter(
    	    User user,
    	    Cryptocurrency cryptocurrency,
    	    String message,
    	    LocalDateTime timestamp
    	);


}
