package com.ecommerce.order.domain.port;

import com.ecommerce.order.domain.model.Order;
import java.util.List;
import java.util.Optional;

public interface OrderRepositoryPort {
    Order save(Order order);
    Optional<Order> findById(Long id);
    List<Order> findAll();
    List<Order> findByCustomerEmail(String email);
    void deleteById(Long id);
}
