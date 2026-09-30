package com.ecommerce.product.infrastructure.config;

import com.ecommerce.product.domain.model.Product;
import com.ecommerce.product.domain.port.ProductRepositoryPort;
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
    public CommandLineRunner initDatabase(ProductRepositoryPort repository) {
        return args -> {
            if (repository.findAll().isEmpty()) {
                log.info("Seeding initial product catalog data...");

                repository.save(Product.createNew(
                        "Minimalist Wireless Noise-Canceling Headphones",
                        "Experience high-fidelity audio with active noise cancellation, 30-hour battery life, and ergonomic leather ear cushions.",
                        new BigDecimal("299.99"),
                        "Electronics",
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
                        "seed-1",
                        25
                ));

                repository.save(Product.createNew(
                        "Ultra-Slim Mechanical Keyboard RGB",
                        "Low-profile mechanical switches, custom keycaps, aircraft-grade aluminum top plate, and dynamic per-key RGB backlighting.",
                        new BigDecimal("149.50"),
                        "Electronics",
                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop",
                        "seed-2",
                        40
                ));

                repository.save(Product.createNew(
                        "Titanium Smart Watch Series X",
                        "Advanced health metrics, AMOLED retina display, GPS tracking, 50m water resistance, and 7-day battery life.",
                        new BigDecimal("399.00"),
                        "Wearables",
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
                        "seed-3",
                        15
                ));

                repository.save(Product.createNew(
                        "Ergonomic Artisan Leather Chair",
                        "Handcrafted genuine top-grain leather executive chair with adaptive lumbar support and synchronized tilt mechanism.",
                        new BigDecimal("680.00"),
                        "Furniture",
                        "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?w=800&auto=format&fit=crop",
                        "seed-4",
                        8
                ));

                log.info("Successfully seeded initial products!");
            }
        };
    }
}
