package com.ecommerce.sportscenter.service.emailtemplate;

import com.ecommerce.sportscenter.entity.OrderAggregate.Order;

public class OrderPlacedEmailTemplate {

    public static String getOrderPlacedEmail(Order order) {
        return String.format(
                "Subject: Your Order #%d has been placed!\n\n" +
                        "Dear %s,\n\n" +
                        "Thank you for your order! Your order #%d has been successfully placed on %s.\n\n" +
                        "Order Details:\n" +
                        "Order ID: %d\n" +
                        "Order Date: %s\n" +
                        "Total Amount: ₹%.2f\n\n" +
                        "Shipping Address:\n" +
                        "%s\n\n" +
                        "We will notify you once your order is shipped.\n\n" +
                        "Thank you for shopping with Sports Center!\n\n" +
                        "Best regards,\n" +
                        "Sports Center Team",
                order.getId(),
                order.getUser().getUsername(),
                order.getId(),
                order.getOrderDate().toString(),
                order.getId(),
                order.getOrderDate(),
                order.getTotal(),
                order.getShippingAddress().toString()
        );
    }
}
