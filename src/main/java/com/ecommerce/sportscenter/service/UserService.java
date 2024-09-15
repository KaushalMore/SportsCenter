package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.User;
import com.ecommerce.sportscenter.model.JwtRequest;
import com.ecommerce.sportscenter.model.JwtResponse;

public interface UserService {

    JwtResponse saveUser(User user);

    JwtResponse authenticate(JwtRequest user);

    JwtResponse findByUsername(String username);

    JwtResponse update(String email, String password);

    JwtResponse deleteUserById(String email);

}
