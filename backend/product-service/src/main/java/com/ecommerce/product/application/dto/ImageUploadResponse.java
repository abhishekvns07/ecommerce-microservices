package com.ecommerce.product.application.dto;

public class ImageUploadResponse {
    private String imageUrl;
    private String fileName;
    private String storageType; // AWS_S3 or LOCAL_MOCK

    public ImageUploadResponse() {}

    public ImageUploadResponse(String imageUrl, String fileName, String storageType) {
        this.imageUrl = imageUrl;
        this.fileName = fileName;
        this.storageType = storageType;
    }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getStorageType() { return storageType; }
    public void setStorageType(String storageType) { this.storageType = storageType; }
}
