package com.ecommerce.sportscenter.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;

@Service
public class FileUploadService {

    private final String UPLOAD_DIR = "C:\\Users\\kaushal More\\Project\\fullstack-java-react\\sportscenter\\client\\public\\images\\products";
    public String uploadFile(MultipartFile photo) {
        try {
            if (photo == null || photo.isEmpty()) {
                throw new Exception("Empty file");
            }
            String filename = photo.getOriginalFilename();
            String path = UPLOAD_DIR + File.separator + filename;

            // Check if content type is a valid image format
            if (!isImageContentType(photo.getContentType())) {
                throw new Exception("Invalid file type. Only images are allowed.");
            }

            Files.copy(photo.getInputStream(), Paths.get(path), StandardCopyOption.REPLACE_EXISTING);
            return imagePath("images\\products" + File.separator + filename);
        } catch (Exception e) {
            throw new RuntimeException("Unable to upload image to local storage : " + e.getMessage());
        }
    }

    private boolean isImageContentType(String contentType) {
        String[] validImageTypes = {"image/jpeg", "image/png", "image/gif", "application/octet-stream"};
        for (String validType : validImageTypes) {
            if (Objects.equals(contentType, validType)) {
                return true;
            }
        }
        return false;
    }

    private String imagePath(String path) {
        String correctPath = "";
        for (int i = 0; i < path.length(); i++) {
            if (path.charAt(i) == '\\') {
                correctPath += path.substring(0, i) + '/';
                path = path.substring(i + 1);
                i = 0;
            }
        }
        return correctPath + path;
    }

}
