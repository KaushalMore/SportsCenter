package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.Basket;
import com.ecommerce.sportscenter.entity.BasketItem;
import com.ecommerce.sportscenter.model.BasketItemResponse;
import com.ecommerce.sportscenter.model.BasketResponse;
import com.ecommerce.sportscenter.repository.BasketRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class BasketServiceImpl implements BasketService {

    private final BasketRepository basketRepository;

    public BasketServiceImpl(BasketRepository basketRepository) {
        this.basketRepository = basketRepository;
    }

    @Override
    public List<BasketResponse> getAllBaskets() {
        log.info("Fetching all Basket");
        List<Basket> basketList = (List<Basket>) basketRepository.findAll();
        List<BasketResponse> basketResponses = basketList.stream().
                map(this::convertToBasketResponse)
                .collect(Collectors.toList());
        log.info("Fetched All Basket");
        return basketResponses;
    }

    @Override
    public BasketResponse getBasketById(String basketId) {
        log.info("Fetching basket by id: {}", basketId);
        Optional<Basket> basketOptoinal = basketRepository.findById(basketId);
        if (basketOptoinal.isPresent()) {
            Basket basket = basketOptoinal.get();
            log.info("Fetched basket by id: {}", basketId);
            return convertToBasketResponse(basket);
        }
        log.info("Basket with id: {} not found", basketId);
        return null;
    }

    @Override
    public void deleteBasketById(String basketId) {
        log.info("Deleting basket by id: {}", basketId);
        basketRepository.deleteById(basketId);
        log.info("Deleted basket by id: {} ", basketId);
    }

    @Override
    public BasketResponse createBasket(Basket basket) {
        log.info("Crating basket");
        Basket savedBasket = basketRepository.save(basket);
        log.info("Basket created with id: {}", basket.getId());
        return convertToBasketResponse(savedBasket);
    }

    private BasketResponse convertToBasketResponse(Basket basket) {
        if (basket == null) {
            return null;
        }

        List<BasketItemResponse> itemResponses = basket.getItems().stream()
                .map(this::convertToBasketItemResponse)
                .collect(Collectors.toList());

        return BasketResponse.builder()
                .id(basket.getId())
                .items(itemResponses)
                .build();
    }

    private BasketItemResponse convertToBasketItemResponse(BasketItem basketItem) {
        return BasketItemResponse.builder()
                .id(basketItem.getId())
                .name(basketItem.getName())
                .description(basketItem.getDescription())
                .price(basketItem.getPrice())
                .pictureUrl(basketItem.getPictureUrl())
                .productBrand(basketItem.getProductBrand())
                .productType(basketItem.getProductType())
                .quantity(basketItem.getQuantity())
                .build();
    }
}
