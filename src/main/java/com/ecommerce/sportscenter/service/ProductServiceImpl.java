package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Brand;
import com.ecommerce.sportscenter.entity.Product;
import com.ecommerce.sportscenter.entity.Type;
import com.ecommerce.sportscenter.exceptions.ProductNotFoundException;
import com.ecommerce.sportscenter.model.ProductResponse;
import com.ecommerce.sportscenter.repository.ProductRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Log4j2
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final FileUploadService fileUploadService;
    private final BrandService brandService;
    private final TypeService typeService;

    public ProductServiceImpl(ProductRepository productRepository, FileUploadService fileUploadService, BrandService brandService, TypeService typeService) {
        this.productRepository = productRepository;
        this.fileUploadService = fileUploadService;
        this.brandService = brandService;
        this.typeService = typeService;
    }

    @Override
    public ProductResponse getProductById(Integer productId) {
        log.info("fetching Product by Id: {}", productId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product doesn't exist"));
        //now convert the Product to Product Response
        ProductResponse productResponse = convertToProductResponse(product);
        log.info("Fetched Product by Product Id: {}", productId);
        return productResponse;
    }

    @Override
    public Page<ProductResponse> getProducts(Pageable pageable, Integer brandId, Integer typeId, String keyword) {
        Specification<Product> spec = Specification.where(null);

        if (brandId != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("brand").get("id"), brandId));
        }

        if (typeId != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type").get("id"), typeId));
        }

        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("name"), "%" + keyword + "%"));
        }

        return productRepository.findAll(spec, pageable).map(this::convertToProductResponse);
    }

    @Override
    public String addProduct(MultipartFile photo, String name, Long price, String description, Brand brand, Type type) {
        try {
            log.info("Creating New Product");
            if (productRepository.existsByName(name)) {
                return "Product with name already exist";
            }
            Product product = new Product();
            product.setName(name);
            String pictureUrl = fileUploadService.uploadFile(photo);
            product.setPictureUrl(pictureUrl);
            product.setPrice(price);
            product.setDescription(description);
            product.setBrand(brand);
            product.setType(type);
            productRepository.save(product);
            log.info("Product Created");
            return "Product added Successfully";
        } catch (Exception e) {
            log.warn("Failed to add Product");
            return "Failed To add Product";
        }
    }

    @Override
    public String updateProduct(Integer productId, MultipartFile photo, String name, Long price, String description, Integer brandId, Integer typeId) {
        try {
            log.info("Updating Product");
            Product product = productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product does not exists"));
            String pictureUrl = null;
            if (photo != null) {
                pictureUrl = fileUploadService.uploadFile(photo);
                product.setPictureUrl(pictureUrl);
            }
            if (name != null) product.setName(name);
            if (price != null) product.setPrice(price);
            if (description != null) product.setDescription(description);
            if (brandId != null) {
                Brand brand = brandService.findById(brandId);
                product.setBrand(brand);
            }
            if (typeId != null) {
                Type type = typeService.findById(typeId);
                product.setType(type);
            }
            productRepository.save(product);
            log.info("Product Updated");
            return "Product added Successfully";
        } catch (ProductNotFoundException e) {
            log.warn("Product does not exists");
            return "Product does not exists";
        } catch (Exception e) {
            log.warn("Failed To add Product");
            return "Failed To add Product";
        }
    }

    @Override
    public String deleteProduct(Integer productId) {
        try {
            log.info("Deleting Product");
            productRepository.findById(productId).orElseThrow(() -> new ProductNotFoundException("Product does not exists"));
            productRepository.deleteById(productId);
            log.info("Product Deleted");
            return "Product deleted Successfully";
        } catch (ProductNotFoundException e) {
            log.warn("Product does not exists");
            return "Product does not exists";
        } catch (Exception e) {
            log.warn("Failed To delete Product");
            return "Failed To delete Product";
        }
    }

    private ProductResponse convertToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .pictureUrl(product.getPictureUrl())
                .productBrand(product.getBrand().getName())
                .productType(product.getType().getName())
                .build();
    }
}
