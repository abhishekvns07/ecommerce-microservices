package com.ecommerce.order.infrastructure.config;

import com.ecommerce.order.domain.model.Order;
import com.ecommerce.order.domain.port.OrderRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initOrders(OrderRepositoryPort repository) {
        return args -> {
            if (repository.findAll().isEmpty()) {
                log.info("Seeding initial order data...");

                repository.save(Order.createNew(
                        "Alex Rivera",
                        "alex@example.com",
                        1L,
                        "Minimalist Wireless Noise-Canceling Headphones",
                        1,
                        new BigDecimal("299.99")
                ));

                repository.save(Order.createNew(
                        "Sophia Chen",
                        "sophia@example.com",
                        3L,
                        "Titanium Smart Watch Series X",
                        2,
                        new BigDecimal("399.00")
                ));

                log.info("Successfully seeded initial orders!");
            }
        };
    }
}
