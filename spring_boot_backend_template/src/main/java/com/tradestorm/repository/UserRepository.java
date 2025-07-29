// UserRepository.java
package com.tradestorm.repository;

import com.cdac.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	boolean existsByEmail(String email);

	boolean existsByPhone(String phone);

	User findByEmail(String email);

	User findByPhone(String phone);
}
