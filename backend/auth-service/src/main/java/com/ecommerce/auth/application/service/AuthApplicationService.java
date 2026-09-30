package com.ecommerce.auth.application.service;

import com.ecommerce.auth.application.dto.AuthRequest;
import com.ecommerce.auth.application.dto.AuthResponse;
import com.ecommerce.auth.application.dto.RegisterRequest;
import com.ecommerce.auth.application.dto.UserResponse;
import com.ecommerce.auth.domain.model.User;
import com.ecommerce.auth.domain.port.UserRepositoryPort;
import com.ecommerce.auth.infrastructure.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthApplicationService implements AuthUseCase {

    private static final Logger log = LoggerFactory.getLogger(AuthApplicationService.class);

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthApplicationService(
            UserRepositoryPort userRepositoryPort,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepositoryPort = userRepositoryPort;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing user registration for username: {}, email: {}", request.getUsername(), request.getEmail());

        if (userRepositoryPort.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }

        if (userRepositoryPort.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already in use");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User newUser = User.createNew(
                request.getUsername(),
                request.getEmail(),
                encodedPassword,
                request.getRole()
        );

        User savedUser = userRepositoryPort.save(newUser);
        log.info("Successfully registered user with ID: {}", savedUser.getId());

        String token = jwtTokenProvider.generateToken(savedUser);
        return new AuthResponse(token, UserResponse.fromDomain(savedUser));
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        log.info("Processing user login attempt for: {}", request.getUsernameOrEmail());

        User user = userRepositoryPort.findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepositoryPort.findByEmail(request.getUsernameOrEmail()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Failed login attempt for user: {}", request.getUsernameOrEmail());
            throw new IllegalArgumentException("Invalid username or password");
        }

        log.info("User successfully authenticated: {}", user.getUsername());
        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, UserResponse.fromDomain(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse validateTokenAndGetUser(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("Invalid or expired JWT token");
        }

        String username = jwtTokenProvider.getUsernameFromJWT(token);
        User user = userRepositoryPort.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found for token"));

        return UserResponse.fromDomain(user);
    }
}
