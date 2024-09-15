package com.ecommerce.sportscenter.service.emailtemplate;

import com.ecommerce.sportscenter.entity.OrderAggregate.Order;

public class CancelledEmailTemplate {

    public static String getCancelledEmail(Order order) {
        return String.format(
                "Subject: Your Order #%d has been cancelled\n\n" +
                        "Dear %s,\n\n" +
                        "We regret to inform you that your order #%d has been cancelled.\n\n" +
                        "Order Details:\n" +
                        "Order ID: %d\n" +
                        "Order Date: %s\n" +
                        "Total Amount: ₹%.2f\n\n" +
                        "If you have any questions or concerns, please contact us.\n\n" +
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

