package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.User;
import com.ecommerce.sportscenter.entity.UserDetailsImpl;
import com.ecommerce.sportscenter.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            System.out.println("User Not found");
            throw new UsernameNotFoundException("User Not found");
        }
        return new UserDetailsImpl(user);
    }
}