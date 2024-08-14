package com.ecommerce.sportscenter.model;

import com.ecommerce.sportscenter.entity.OrderAggregate.OrderItem;
import com.ecommerce.sportscenter.entity.OrderAggregate.OrderStatus;
import com.ecommerce.sportscenter.entity.OrderAggregate.ShippingAddress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private Integer id;
    private String basketId;
    private List<OrderItem> orderItems = new ArrayList<>();
    private ShippingAddress shippingAddress;
    private Long subTotal;
    private Long deliveryFee;
    private Double total;
    private LocalDateTime orderDate;
    private OrderStatus orderStatus;

}
