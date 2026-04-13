package com.example.dto;

import com.example.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    public Long id;
    public String name;
    public String description;
    public BigDecimal price;
    public Integer stock;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public ProductResponse() {
    }

    public ProductResponse(Product product) {
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.stock = product.stock;
        this.createdAt = product.createdAt;
        this.updatedAt = product.updatedAt;
    }
}
