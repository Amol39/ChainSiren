
package com.tradestorm.repository;

import com.cdac.model.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	boolean existsByEmail(String email);

	boolean existsByPhone(String phone);

	Optional<User> findByEmail(String email);

	Optional<User> findByPhone(String phone);
}
