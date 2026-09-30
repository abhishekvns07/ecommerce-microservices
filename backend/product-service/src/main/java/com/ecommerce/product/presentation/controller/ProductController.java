package com.ecommerce.product.presentation.controller;

import com.ecommerce.product.application.dto.CreateProductRequest;
import com.ecommerce.product.application.dto.ImageUploadResponse;
import com.ecommerce.product.application.dto.ProductDTO;
import com.ecommerce.product.application.service.ProductUseCase;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger log = LoggerFactory.getLogger(ProductController.class);
    private final ProductUseCase productUseCase;

    public ProductController(ProductUseCase productUseCase) {
        this.productUseCase = productUseCase;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(@RequestParam(value = "category", required = false) String category) {
        log.info("HTTP GET /api/products - Category filter: {}", category);
        if (category != null && !category.trim().isEmpty()) {
            return ResponseEntity.ok(productUseCase.getProductsByCategory(category));
        }
        return ResponseEntity.ok(productUseCase.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable("id") Long id) {
        log.info("HTTP GET /api/products/{}", id);
        return ResponseEntity.ok(productUseCase.getProductById(id));
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<ProductDTO> createProduct(
            @RequestPart("product") @Valid CreateProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        log.info("HTTP POST /api/products - Create product: {}", request.getTitle());
        ProductDTO created = productUseCase.createProduct(request, imageFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/upload-image")
    public ResponseEntity<ImageUploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        log.info("HTTP POST /api/products/upload-image - Uploading image: {}", file.getOriginalFilename());
        ImageUploadResponse response = productUseCase.uploadImage(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
        log.info("HTTP DELETE /api/products/{}", id);
        productUseCase.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/images/{fileName:.+}")
    public ResponseEntity<Resource> serveLocalImage(@PathVariable("fileName") String fileName) {
        try {
            Path filePath = Paths.get("./uploads/").resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "service", "product-service",
                "status", "UP",
                "architecture", "Onion Architecture",
                "storage", "AWS S3 / Local Fallback",
                "database", "PostgreSQL / H2"
        ));
    }
}
