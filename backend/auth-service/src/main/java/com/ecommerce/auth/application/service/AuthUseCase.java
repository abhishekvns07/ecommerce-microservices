package com.ecommerce.auth.application.service;

import com.ecommerce.auth.application.dto.AuthRequest;
import com.ecommerce.auth.application.dto.AuthResponse;
import com.ecommerce.auth.application.dto.RegisterRequest;
import com.ecommerce.auth.application.dto.UserResponse;

public interface AuthUseCase {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    UserResponse validateTokenAndGetUser(String token);
}
