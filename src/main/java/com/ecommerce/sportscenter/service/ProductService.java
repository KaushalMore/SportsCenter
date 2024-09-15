package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Brand;
import com.ecommerce.sportscenter.entity.Type;
import com.ecommerce.sportscenter.model.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ProductService {
    ProductResponse getProductById(Integer productId);

    Page<ProductResponse> getProducts(Pageable pageable, Integer brandId, Integer typeId, String keyword);

    String addProduct(MultipartFile photo, String name, Long price, String description, Brand brandId, Type typeId);

    String updateProduct(Integer productId, MultipartFile photo, String name, Long price, String description, Integer brand, Integer type);

    String deleteProduct(Integer productId);
}
