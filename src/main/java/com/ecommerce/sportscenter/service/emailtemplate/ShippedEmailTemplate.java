package com.ecommerce.sportscenter.service.emailtemplate;

import com.ecommerce.sportscenter.entity.OrderAggregate.Order;

public class ShippedEmailTemplate {

    public static String getShippedEmail(Order order) {
        return String.format(
                "Subject: Your Order #%d has been shipped!\n\n" +
                        "Dear %s,\n\n" +
                        "Good news! Your order #%d has been shipped and is on its way.\n\n" +
                        "Order Details:\n" +
                        "Order ID: %d\n" +
                        "Order Date: %s\n" +
                        "Total Amount: ₹%.2f\n\n" +
                        "Shipping Address:\n" +
                        "%s\n\n" +
                        "You can track your shipment using the following tracking number: [Tracking Number]\n\n" +
                        "Thank you for shopping with Sports Center!\n\n" +
                        "Best regards,\n" +
                        "Sports Center Team",
                order.getId(),
                order.getUser().getUsername(),
                order.getId(),
                order.getId(),
                order.getOrderDate().toString(),
                order.getTotal(),
                order.getShippingAddress().toString()
        );
    }
}

