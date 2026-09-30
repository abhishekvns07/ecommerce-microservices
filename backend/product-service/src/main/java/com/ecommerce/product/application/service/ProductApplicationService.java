package com.ecommerce.product.application.service;

import com.ecommerce.product.application.dto.CreateProductRequest;
import com.ecommerce.product.application.dto.ImageUploadResponse;
import com.ecommerce.product.application.dto.ProductDTO;
import com.ecommerce.product.domain.model.Product;
import com.ecommerce.product.domain.port.ProductRepositoryPort;
import com.ecommerce.product.domain.port.StoragePort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductApplicationService implements ProductUseCase {

    private static final Logger log = LoggerFactory.getLogger(ProductApplicationService.class);

    private final ProductRepositoryPort productRepositoryPort;
    private final StoragePort storagePort;

    public ProductApplicationService(ProductRepositoryPort productRepositoryPort, StoragePort storagePort) {
        this.productRepositoryPort = productRepositoryPort;
        this.storagePort = storagePort;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        log.info("Fetching all products from repository");
        return productRepositoryPort.findAll().stream()
                .map(ProductDTO::fromDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        log.info("Fetching product by ID: {}", id);
        Product product = productRepositoryPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product with ID " + id + " not found"));
        return ProductDTO.fromDomain(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCategory(String category) {
        log.info("Fetching products in category: {}", category);
        return productRepositoryPort.findByCategory(category).stream()
                .map(ProductDTO::fromDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductDTO createProduct(CreateProductRequest request, MultipartFile imageFile) {
        log.info("Creating new product: {}", request.getTitle());

        String imageUrl = request.getImageUrl();
        String s3Key = null;

        if (imageFile != null && !imageFile.isEmpty()) {
            ImageUploadResponse uploadRes = uploadImage(imageFile);
            imageUrl = uploadRes.getImageUrl();
            s3Key = uploadRes.getFileName();
        }

        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop";
        }

        Product product = Product.createNew(
                request.getTitle(),
                request.getDescription(),
                request.getPrice(),
                request.getCategory(),
                imageUrl,
                s3Key,
                request.getStock()
        );

        Product saved = productRepositoryPort.save(product);
        log.info("Product created successfully with ID: {}", saved.getId());
        return ProductDTO.fromDomain(saved);
    }

    @Override
    public ImageUploadResponse uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot upload an empty file");
        }

        try {
            log.info("Processing file upload: {}, size: {} bytes", file.getOriginalFilename(), file.getSize());
            String imageUrl = storagePort.uploadFile(
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getSize(),
                    file.getInputStream()
            );

            String storageType = imageUrl.contains("amazonaws.com") ? "AWS_S3" : "LOCAL_MOCK";
            return new ImageUploadResponse(imageUrl, file.getOriginalFilename(), storageType);

        } catch (IOException e) {
            log.error("Failed to read image stream during upload", e);
            throw new RuntimeException("Image upload failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Deleting product ID: {}", id);
        Product product = productRepositoryPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (product.getS3Key() != null) {
            storagePort.deleteFile(product.getS3Key());
        }

        productRepositoryPort.deleteById(id);
        log.info("Product ID {} deleted successfully", id);
    }
}
