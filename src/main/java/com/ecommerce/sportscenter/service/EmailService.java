package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.OrderAggregate.Order;
import com.ecommerce.sportscenter.service.emailtemplate.*;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(body);
            javaMailSender.send(mail);
            log.info("Email sent successfully");
        } catch (Exception e) {
            log.error("Exception while sending email: {}", e.getMessage());
        }
    }

    public void sendOrderStatusEmail(Order order) {
        String subject = "";
        String body = "";

        switch (order.getOrderStatus()) {
            case Pending:
                subject = "Your Order #" + order.getId() + " has been placed!";
                body = OrderPlacedEmailTemplate.getOrderPlacedEmail(order);
                break;
            case PaymentReceived:
                subject = "Payment Received for Your Order #" + order.getId();
                body = PaymentReceivedEmailTemplate.getPaymentReceivedEmail(order);
                break;
            case PaymentFailed:
                subject = "Payment Failed for Your Order #" + order.getId();
                body = PaymentFailedEmailTemplate.getPaymentFailedEmail(order);
                break;
            case Shipped:
                subject = "Your Order #" + order.getId() + " has been shipped!";
                body = ShippedEmailTemplate.getShippedEmail(order);
                break;
            case Delivered:
                subject = "Your Order #" + order.getId() + " has been delivered!";
                body = DeliveredEmailTemplate.getDeliveredEmail(order);
                break;
            case Cancelled:
                subject = "Your Order #" + order.getId() + " has been cancelled";
                body = CancelledEmailTemplate.getCancelledEmail(order);
                break;
            case Returned:
                subject = "Your Order #" + order.getId() + " has been returned";
                body = ReturnedEmailTemplate.getReturnedEmail(order);
                break;
            case Refunded:
                subject = "Your Order #" + order.getId() + " has been refunded";
                body = RefundedEmailTemplate.getRefundedEmail(order);
                break;
            default:
                log.warn("Unknown order status: " + order.getOrderStatus());
                return;
        }

        sendEmail(order.getUser().getEmail(), subject, body);
    }
}
