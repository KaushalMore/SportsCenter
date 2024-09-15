package com.ecommerce.sportscenter.repository;


import com.ecommerce.sportscenter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);
}
