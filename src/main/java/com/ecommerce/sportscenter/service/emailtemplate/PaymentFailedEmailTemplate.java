package com.ecommerce.sportscenter.service.emailtemplate;

import com.ecommerce.sportscenter.entity.OrderAggregate.Order;

public class PaymentFailedEmailTemplate {

    public static String getPaymentFailedEmail(Order order) {
        return String.format(
                "Subject: Payment Failed for Your Order #%d\n\n" +
                        "Dear %s,\n\n" +
                        "Unfortunately, the payment for your order #%d has failed. Please try again or contact our support team for assistance.\n\n" +
                        "Order Details:\n" +
                        "Order ID: %d\n" +
                        "Order Date: %s\n" +
                        "Total Amount: ₹%.2f\n\n" +
                        "Shipping Address:\n" +
                        "%s\n\n" +
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

