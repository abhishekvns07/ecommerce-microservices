package com.ecommerce.order.presentation.controller;

import com.ecommerce.order.application.dto.CreateOrderRequest;
import com.ecommerce.order.application.dto.OrderDTO;
import com.ecommerce.order.application.service.OrderUseCase;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    private final OrderUseCase orderUseCase;

    public OrderController(OrderUseCase orderUseCase) {
        this.orderUseCase = orderUseCase;
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders(@RequestParam(value = "email", required = false) String email) {
        log.info("HTTP GET /api/orders - Email filter: {}", email);
        if (email != null && !email.trim().isEmpty()) {
            return ResponseEntity.ok(orderUseCase.getOrdersByCustomerEmail(email));
        }
        return ResponseEntity.ok(orderUseCase.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable("id") Long id) {
        log.info("HTTP GET /api/orders/{}", id);
        return ResponseEntity.ok(orderUseCase.getOrderById(id));
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        log.info("HTTP POST /api/orders - Create Order for Product ID: {}", request.getProductId());
        OrderDTO created = orderUseCase.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("id") Long id) {
        log.info("HTTP DELETE /api/orders/{}", id);
        orderUseCase.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "service", "order-service",
                "status", "UP",
                "port", "8082",
                "database", "MySQL / H2"
        ));
    }
}
