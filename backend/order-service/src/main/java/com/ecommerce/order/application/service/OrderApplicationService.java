package com.ecommerce.order.application.service;

import com.ecommerce.order.application.dto.CreateOrderRequest;
import com.ecommerce.order.application.dto.OrderDTO;
import com.ecommerce.order.domain.model.Order;
import com.ecommerce.order.domain.port.OrderRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderApplicationService implements OrderUseCase {

    private static final Logger log = LoggerFactory.getLogger(OrderApplicationService.class);
    private final OrderRepositoryPort orderRepositoryPort;

    public OrderApplicationService(OrderRepositoryPort orderRepositoryPort) {
        this.orderRepositoryPort = orderRepositoryPort;
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        log.info("Fetching all customer orders");
        return orderRepositoryPort.findAll().stream()
                .map(OrderDTO::fromDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        log.info("Fetching order ID: {}", id);
        Order order = orderRepositoryPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order with ID " + id + " not found"));
        return OrderDTO.fromDomain(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByCustomerEmail(String email) {
        log.info("Fetching orders for customer email: {}", email);
        return orderRepositoryPort.findByCustomerEmail(email).stream()
                .map(OrderDTO::fromDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderDTO createOrder(CreateOrderRequest request) {
        log.info("Creating new order for product ID: {} by {}", request.getProductId(), request.getCustomerName());
        Order newOrder = Order.createNew(
                request.getCustomerName(),
                request.getCustomerEmail(),
                request.getProductId(),
                request.getProductName(),
                request.getQuantity(),
                request.getUnitPrice()
        );

        Order saved = orderRepositoryPort.save(newOrder);
        log.info("Order placed successfully with ID: {}", saved.getId());
        return OrderDTO.fromDomain(saved);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        log.info("Canceling order ID: {}", id);
        if (orderRepositoryPort.findById(id).isEmpty()) {
            throw new IllegalArgumentException("Order ID " + id + " does not exist");
        }
        orderRepositoryPort.deleteById(id);
    }
}
