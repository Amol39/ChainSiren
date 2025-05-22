// NotificationRepository.java
package com.tradestorm.repository;

import com.cdac.model.Cryptocurrency;
import com.cdac.model.Notification;
import com.cdac.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
	List<Notification> findByUserUserId(Long userId);
	List<Notification> findByUser(User user);
	List<Notification> findByCryptocurrency(Cryptocurrency cryptocurrency);
	
	// NotificationRepository.java
	@Query("SELECT n FROM Notification n WHERE n.user = :user AND n.cryptocurrency = :crypto AND n.message = :message")
	Optional<Notification> findDuplicate(@Param("user") User user,
	                                     @Param("crypto") Cryptocurrency crypto,
	                                     @Param("message") String message);

}
