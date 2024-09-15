package com.ecommerce.sportscenter.service.emailtemplate;

import com.ecommerce.sportscenter.entity.OrderAggregate.Order;

public class DeliveredEmailTemplate {

    public static String getDeliveredEmail(Order order) {
        return String.format(
                "Subject: Your Order #%d has been delivered!\n\n" +
                        "Dear %s,\n\n" +
                        "We are pleased to inform you that your order #%d has been delivered.\n\n" +
                        "Order Details:\n" +
                        "Order ID: %d\n" +
                        "Order Date: %s\n" +
                        "Total Amount: ₹%.2f\n\n" +
                        "Shipping Address:\n" +
                        "%s\n\n" +
                        "We hope you enjoy your purchase! If you have any questions or concerns, please contact us.\n\n" +
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

