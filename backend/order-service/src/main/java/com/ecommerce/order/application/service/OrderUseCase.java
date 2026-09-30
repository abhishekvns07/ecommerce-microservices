package com.ecommerce.order.application.service;

import com.ecommerce.order.application.dto.CreateOrderRequest;
import com.ecommerce.order.application.dto.OrderDTO;
import java.util.List;

public interface OrderUseCase {
    List<OrderDTO> getAllOrders();
    OrderDTO getOrderById(Long id);
    List<OrderDTO> getOrdersByCustomerEmail(String email);
    OrderDTO createOrder(CreateOrderRequest request);
    void deleteOrder(Long id);
}
