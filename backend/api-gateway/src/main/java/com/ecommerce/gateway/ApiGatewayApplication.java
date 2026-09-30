package com.ecommerce.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

import java.util.Map;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouterFunction<ServerResponse> homeRoute() {
        return RouterFunctions.route()
                .GET("/", request -> ServerResponse.ok().bodyValue(Map.of(
                        "status", "UP",
                        "service", "E-Commerce API Gateway",
                        "version", "1.0.0",
                        "message", "Welcome to the E-Commerce Microservices API Gateway",
                        "endpoints", Map.of(
                                "products", "/api/products",
                                "orders", "/api/orders",
                                "auth", "/api/auth",
                                "eureka", "http://localhost:8761",
                                "frontend", "http://localhost:5173"
                        )
                )))
                .build();
    }
}
