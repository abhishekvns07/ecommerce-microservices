package com.ecommerce.product.application.service;

import com.ecommerce.product.application.dto.CreateProductRequest;
import com.ecommerce.product.application.dto.ImageUploadResponse;
import com.ecommerce.product.application.dto.ProductDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductUseCase {
    List<ProductDTO> getAllProducts();
    ProductDTO getProductById(Long id);
    List<ProductDTO> getProductsByCategory(String category);
    ProductDTO createProduct(CreateProductRequest request, MultipartFile imageFile);
    ImageUploadResponse uploadImage(MultipartFile file);
    void deleteProduct(Long id);
}
