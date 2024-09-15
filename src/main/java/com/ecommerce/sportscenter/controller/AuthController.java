package com.ecommerce.sportscenter.controller;

import com.ecommerce.sportscenter.entity.User;
import com.ecommerce.sportscenter.model.JwtRequest;
import com.ecommerce.sportscenter.model.JwtResponse;
import com.ecommerce.sportscenter.model.UserDto;
import com.ecommerce.sportscenter.security.JwtHelper;
import com.ecommerce.sportscenter.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtHelper jwtHelper;

    public AuthController(UserService userService, JwtHelper jwtHelper) {
        this.userService = userService;
        this.jwtHelper = jwtHelper;
    }

    @PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@RequestBody User request) {
        JwtResponse response = userService.saveUser(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {
        JwtResponse response = userService.authenticate(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/user")
    public ResponseEntity<UserDto> getUserDetails(@RequestHeader("Authorization") String tokenHeader) {
        String token = extractTokenFromHeader(tokenHeader);
        if (token != null) {
            String username = jwtHelper.getUserNameFromToken(token);
            JwtResponse byUsername = userService.findByUsername(username);
            return new ResponseEntity<>(byUsername.getUserDto(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    private String extractTokenFromHeader(String tokenHeader) {
        if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
            return tokenHeader.substring(7); // Removing Bearer
        }
        return null;
    }

}
