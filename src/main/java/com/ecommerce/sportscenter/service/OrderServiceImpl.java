package com.ecommerce.sportscenter.service;

import com.ecommerce.sportscenter.entity.OrderAggregate.Order;
import com.ecommerce.sportscenter.entity.OrderAggregate.OrderItem;
import com.ecommerce.sportscenter.entity.OrderAggregate.OrderStatus;
import com.ecommerce.sportscenter.entity.OrderAggregate.ProductItemOrdered;
import com.ecommerce.sportscenter.entity.User;
import com.ecommerce.sportscenter.mapper.OrderMapper;
import com.ecommerce.sportscenter.model.*;
import com.ecommerce.sportscenter.repository.BrandRepository;
import com.ecommerce.sportscenter.repository.OrderRepository;
import com.ecommerce.sportscenter.repository.TypeRepository;
import com.ecommerce.sportscenter.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final BasketService basketService;
    private final OrderMapper orderMapper;
    private final EmailService emailService;
    private final UserRepository userRepository;

    public OrderServiceImpl(OrderRepository orderRepository, BrandRepository brandRepository, TypeRepository typeRepository, BasketService basketService, OrderMapper orderMapper, EmailService emailService, EmailService emailService1, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.basketService = basketService;
        this.orderMapper = orderMapper;
        this.emailService = emailService1;
        this.userRepository = userRepository;
    }

    @Override
    public OrderResponse getOrderById(Integer orderId) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        return optionalOrder.map(orderMapper::OrderToOrderResponse).orElse(null);
    }

    @Override
    public List<OrderResponse> getAllOrders(Integer userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(orderMapper::OrderToOrderResponse).collect(Collectors.toList());
    }

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(orderMapper::OrderToOrderResponse);
    }

    @Override
    public Integer createOrder(OrderDto orderDto) {
        //Fetching Basket details
        BasketResponse basketResponse = basketService.getBasketById(orderDto.getBasketId());
        if (basketResponse == null) {
            log.error("Basket with ID {} not found", orderDto.getBasketId());
            return null;
        }
        //Map basket items to order items
        List<OrderItem> orderItems = basketResponse.getItems().stream()
                .map(this::mapBasketItemToOrderItem)
                .collect(Collectors.toList());

        //calculate subtotal
        double subTotal = basketResponse.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        //set order details
        Order order = orderMapper.orderResponseToOrder(orderDto);
        order.setOrderItems(orderItems);
        order.setSubTotal(subTotal);
        order.setOrderDate(LocalDateTime.now());
        User user = userRepository.findById(orderDto.getUserDto().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + orderDto.getUserDto().getId()));
        order.setUser(user);

        //save the order
        Order savedOrder = orderRepository.save(order);

        List<OrderItem> collect = orderItems.stream().peek(orderItem -> orderItem.setOrder(order)).collect(Collectors.toList());
        savedOrder.setOrderItems(collect);
        orderRepository.save(savedOrder);

        emailService.sendOrderStatusEmail(savedOrder);
        basketService.deleteBasketById(orderDto.getBasketId());

        log.info("Order saved Successfully");
        //return the response
        return savedOrder.getId();
    }

    @Override
    public OrderResponse updateOrderStatus(Integer orderId, String status) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new RuntimeException("Order not found for id : " + orderId);
        }
        Order order = optionalOrder.get();
        OrderStatus validStatus = validateOrderStatus(status);
        order.setOrderStatus(validStatus);
        Order saved = orderRepository.save(order);
        log.info("Order updated Successfully");
        emailService.sendOrderStatusEmail(saved);
        return optionalOrder.map(orderMapper::OrderToOrderResponse).orElse(null);
    }

    @Override
    public String deleteOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getOrderStatus().equals(OrderStatus.Cancelled)) {
//            emailService.sendOrderStatusEmail(order);
            orderRepository.delete(order);
            log.info("Order Deleted Successfully");
            return "Order Deleted Successfully";
        }
        return "Cancel Order Inorder To Delete Order";
    }

    @Override
    public String cancelOrder(Integer userId, Integer orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        if (!isUserAuthorizedToDelete(order, userId)) {
            log.error("User not authorized to cancel this order");
            throw new RuntimeException("User not authorized to cancel this order");
        }
        order.setOrderStatus(OrderStatus.Cancelled);
        orderRepository.save(order);
        log.info("Order Cancelled Successfully");
        emailService.sendOrderStatusEmail(order);
        return "Order Cancelled Successfully";
    }

    @Override
    public String returnOrder(Integer userId, Integer orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
        if (!isUserAuthorizedToDelete(order, userId)) {
            log.error("User not authorized to return this order");
            throw new RuntimeException("User not authorized to return this order");
        }
        order.setOrderStatus(OrderStatus.Returned);
        orderRepository.save(order);
        log.info("Order Returned Successfully");
        emailService.sendOrderStatusEmail(order);
        return "Order Return Successfully";
    }

    private OrderItem mapBasketItemToOrderItem(BasketItemResponse basketItemResponse) {
        if (basketItemResponse != null) {
            OrderItem orderItem = new OrderItem();
            orderItem.setItemOrdered(mapBasketItemToProduct(basketItemResponse));
            orderItem.setQuantity(basketItemResponse.getQuantity());
            orderItem.setPrice(basketItemResponse.getPrice());
            return orderItem;
        } else {
            return null;
        }
    }

    private ProductItemOrdered mapBasketItemToProduct(BasketItemResponse basketItemResponse) {
        ProductItemOrdered productItemOrdered = new ProductItemOrdered();
        //Populate
        productItemOrdered.setName(basketItemResponse.getName());
        productItemOrdered.setPictureUrl(basketItemResponse.getPictureUrl());
        productItemOrdered.setProductId(basketItemResponse.getId());
        return productItemOrdered;
    }

    private boolean isUserAuthorizedToDelete(Order order, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
        return order.getUser().getId().equals(user.getId()) || user.getRole().equals("ADMIN");
    }

    private static OrderStatus validateOrderStatus(String status) {
        try {
            return OrderStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid order status: " + status);
        }
    }

}
