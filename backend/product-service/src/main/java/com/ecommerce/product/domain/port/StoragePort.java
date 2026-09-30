package com.ecommerce.product.domain.port;

import java.io.InputStream;

public interface StoragePort {
    /**
     * Uploads a file/image stream to storage (AWS S3 or local fallback)
     * @param fileName original name of the file
     * @param contentType MIME type of the file (e.g. image/png, image/jpeg)
     * @param contentLength byte size of the stream
     * @param inputStream data stream
     * @return public or accessible URL of the uploaded image
     */
    String uploadFile(String fileName, String contentType, long contentLength, InputStream inputStream);

    /**
     * Deletes a file from AWS S3 storage by key
     */
    void deleteFile(String key);
}
