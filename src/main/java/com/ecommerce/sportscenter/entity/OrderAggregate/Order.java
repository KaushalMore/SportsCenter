package com.ecommerce.sportscenter.entity.OrderAggregate;

import com.ecommerce.sportscenter.entity.User;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="Orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Id")
    private Integer id;
    @Column(name="Basket_Id")
    private String basketId;
    @Embedded
    private ShippingAddress shippingAddress;
    @Column(name="Order_Date")
    private LocalDateTime orderDate = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "order")
    private List<OrderItem> orderItems = new ArrayList<>();

    @Column(name="Sub_Total")
    private Double subTotal;
    @Column(name="Delivery_Fee")
    private Long deliveryFee;
    @Enumerated(EnumType.STRING)
    @Column(name="Order_Status")
    private OrderStatus orderStatus = OrderStatus.Pending;
    
    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    public Double getTotal() {
        return getSubTotal()+getDeliveryFee();
    }

    @PostConstruct
    public void init() {
        if (orderItems == null) {
            orderItems = new ArrayList<>();
        }
    }
}
