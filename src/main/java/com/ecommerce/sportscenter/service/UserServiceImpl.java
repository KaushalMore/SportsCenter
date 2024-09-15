package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.User;
import com.ecommerce.sportscenter.exceptions.MyException;
import com.ecommerce.sportscenter.model.JwtRequest;
import com.ecommerce.sportscenter.model.JwtResponse;
import com.ecommerce.sportscenter.model.UserDto;
import com.ecommerce.sportscenter.repository.UserRepository;
import com.ecommerce.sportscenter.security.JwtHelper;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtHelper jwtService;

    public UserServiceImpl(UserRepository userRepository, AuthenticationManager authenticationManager, JwtHelper jwtService) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    @Override
    public JwtResponse saveUser(User user) {
        JwtResponse jwtResponse = new JwtResponse();
        try {
            if (userRepository.existsByEmail(user.getEmail()) || userRepository.existsByUsername(user.getUsername())) {
                throw new MyException(user.getUsername() + " Already Exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setRole("USER");
            User savedUser = userRepository.save(user);
            UserDto userDTO = mapUserEntityToUserDto(savedUser);

            jwtResponse.setStatusCode(200);
            jwtResponse.setMessage("successful");
            jwtResponse.setUserDto(userDTO);
        } catch (MyException e) {
            jwtResponse.setStatusCode(400);
            jwtResponse.setMessage("Already Exists, Try different username or email");
        } catch (Exception e) {
            jwtResponse.setStatusCode(500);
            jwtResponse.setMessage("Error occurred during user Registration : " + e.getMessage());
        }

        return jwtResponse;
    }

    @Override
    public JwtResponse authenticate(JwtRequest jwtRequest) {
        JwtResponse jwtResponse = new JwtResponse();
        try {
            try {
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        jwtRequest.getUsername(), jwtRequest.getPassword()));
            } catch (BadCredentialsException ex) {
                throw new BadCredentialsException("Invalid username or password");
            }
            User user = userRepository.findByUsername(jwtRequest.getUsername())
                    .orElseThrow(() -> new MyException("User Not Found"));
            var token = jwtService.generateToken(user.getUsername());
            UserDto userDto = mapUserEntityToUserDto(user);

            jwtResponse.setStatusCode(200);
            jwtResponse.setToken(token);
            jwtResponse.setUsername(userDto.getUsername());
            jwtResponse.setUserDto(userDto);
            jwtResponse.setMessage("successful");
        } catch (MyException e) {
            jwtResponse.setStatusCode(404);
            jwtResponse.setMessage(e.getMessage());
        } catch (Exception e) {
            jwtResponse.setStatusCode(500);
            jwtResponse.setMessage("Error occurred during user Login : " + e.getMessage());
        }
        return jwtResponse;
    }

    @Override
    public JwtResponse findByUsername(String username) {
        JwtResponse jwtResponse = new JwtResponse();
        try {
            User user = userRepository.findByUsername(username).orElseThrow(() -> new MyException("User Not Found"));
            UserDto userDto = mapUserEntityToUserDto(user);
            jwtResponse.setStatusCode(200);
            jwtResponse.setMessage("successful");
            jwtResponse.setUserDto(userDto);
        } catch (MyException e) {
            jwtResponse.setStatusCode(404);
            jwtResponse.setMessage(e.getMessage());
        } catch (Exception e) {
            jwtResponse.setStatusCode(500);
            jwtResponse.setMessage("Error finding users : " + e.getMessage());
        }
        return jwtResponse;
    }

    @Override
    public JwtResponse update(String email, String password) {
        JwtResponse jwtResponse = new JwtResponse();
        return jwtResponse;
    }

    @Override
    public JwtResponse deleteUserById(String email) {
        JwtResponse jwtResponse = new JwtResponse();
        return jwtResponse;
    }

    private UserDto mapUserEntityToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .orderList(user.getOrderList())
                .build();
    }


}
