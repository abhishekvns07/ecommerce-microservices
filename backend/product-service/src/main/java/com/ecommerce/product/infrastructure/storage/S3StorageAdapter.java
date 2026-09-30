package com.ecommerce.product.infrastructure.storage;

import com.ecommerce.product.domain.port.StoragePort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class S3StorageAdapter implements StoragePort {

    private static final Logger log = LoggerFactory.getLogger(S3StorageAdapter.class);

    @Value("${aws.s3.bucket:ecommerce-product-images}")
    private String bucketName;

    @Value("${aws.region:us-east-1}")
    private String awsRegion;

    @Value("${aws.access-key-id:}")
    private String accessKey;

    @Value("${aws.secret-access-key:}")
    private String secretKey;

    @Value("${app.storage.upload-dir:./uploads/}")
    private String uploadDir;

    @Override
    public String uploadFile(String originalFileName, String contentType, long contentLength, InputStream inputStream) {
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        } else {
            fileExtension = ".jpg";
        }
        String s3Key = "products/" + UUID.randomUUID().toString() + fileExtension;

        // Try AWS S3 Upload if credentials exist
        if (accessKey != null && !accessKey.trim().isEmpty() && secretKey != null && !secretKey.trim().isEmpty()) {
            try {
                log.info("Uploading image to AWS S3 Bucket: '{}' with Key: '{}'", bucketName, s3Key);

                S3Client s3Client = S3Client.builder()
                        .region(Region.of(awsRegion))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        ))
                        .build();

                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(s3Key)
                        .contentType(contentType)
                        .acl(ObjectCannedACL.PUBLIC_READ)
                        .build();

                s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, contentLength));
                s3Client.close();

                String s3Url = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, awsRegion, s3Key);
                log.info("AWS S3 Upload Successful. Public URL: {}", s3Url);
                return s3Url;

            } catch (Exception e) {
                log.error("Failed to upload to AWS S3. Falling back to local storage simulation. Error: {}", e.getMessage());
            }
        }

        // Fallback: Local storage simulation
        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
            File targetFile = new File(uploadDir + s3Key.replace("products/", ""));
            try (FileOutputStream out = new FileOutputStream(targetFile)) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }
            log.info("Saved image to local storage fallback: {}", targetFile.getAbsolutePath());
            return "/api/products/images/" + targetFile.getName();

        } catch (Exception ex) {
            log.error("Error saving file to local fallback storage", ex);
            return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop";
        }
    }

    @Override
    public void deleteFile(String key) {
        if (accessKey != null && !accessKey.trim().isEmpty() && secretKey != null && !secretKey.trim().isEmpty()) {
            try {
                S3Client s3Client = S3Client.builder()
                        .region(Region.of(awsRegion))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        ))
                        .build();

                s3Client.deleteObject(DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build());
                s3Client.close();
                log.info("Deleted object from AWS S3: {}", key);
            } catch (Exception e) {
                log.error("Error deleting file from AWS S3: {}", e.getMessage());
            }
        }
    }
}
