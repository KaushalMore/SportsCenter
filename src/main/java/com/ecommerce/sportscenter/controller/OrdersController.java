package com.ecommerce.sportscenter.controller;

import com.ecommerce.sportscenter.model.OrderDto;
import com.ecommerce.sportscenter.model.OrderResponse;
import com.ecommerce.sportscenter.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    private final OrderService orderService;

    public OrdersController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer orderId) {
        OrderResponse order = orderService.getOrderById(orderId);
        if (order != null) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getAllOrders(@PathVariable("userId") Integer userId) {
        List<OrderResponse> orders = orderService.getAllOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/paged")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<OrderResponse>> getAllOrdersPaged(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
//            @RequestParam(name = "keyword", required = false) String keyword,
//            @RequestParam(name = "order", defaultValue = "asc") String order,
//            @RequestParam(name = "sort", defaultValue = "id") String sort
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponse> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<Integer> createOrder(@Valid @RequestBody OrderDto orderDto) {
        Integer orderId = orderService.createOrder(orderDto);
        if (orderId != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(orderId);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/cancel/{userId}/{orderId}")
//    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<String> cancelOrder(
            @PathVariable("userId") Integer userId,
            @PathVariable("orderId") Integer orderId
    ) {
        String message = orderService.cancelOrder(userId, orderId);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @GetMapping("/return/{userId}/{orderId}")
    public ResponseEntity<String> returnOrder(
            @PathVariable("userId") Integer userId,
            @PathVariable("orderId") Integer orderId
    ) {
        String message = orderService.returnOrder(userId, orderId);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @DeleteMapping("/delete/{orderId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteOrder(
            @PathVariable("orderId") Integer orderId
    ) {
        String message = orderService.deleteOrder(orderId);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @PutMapping("/update/{orderId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrder(
            @PathVariable("orderId") Integer orderId, @RequestParam("orderStatus") String orderStatus
    ) {
        OrderResponse orderResponse = orderService.updateOrderStatus(orderId, orderStatus);
        return ResponseEntity.status(HttpStatus.OK).body(orderResponse);
    }

}
