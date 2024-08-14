package com.ecommerce.sportscenter.entity.OrderAggregate;

public enum OrderStatus {
    Pending,
    PaymentReceived,
    PaymentFailed,
    Shipped,
    Delivered,
    Cancelled,
    Returned,
    Refunded
}
