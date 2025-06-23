// UserRepository.java
package com.tradestorm.repository;

import com.cdac.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	
	boolean existsByEmail(String email);

	User findByEmail(String email);
}
