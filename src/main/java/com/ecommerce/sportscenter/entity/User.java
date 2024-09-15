package com.ecommerce.sportscenter.entity;

import com.ecommerce.sportscenter.entity.OrderAggregate.Order;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "User")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="Id")
    private Integer id;

    private String username;
    private String password;
    private String email;
    private String role;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Order> orderList = new ArrayList<>();

}
