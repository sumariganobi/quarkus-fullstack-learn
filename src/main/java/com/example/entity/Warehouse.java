package com.example.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
public class Warehouse extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank(message = "Warehouse name is required")
    @Column(nullable = false)
    public String name;

    @NotBlank(message = "Location is required")
    @Column(nullable = false)
    public String location;

    @Column(columnDefinition = "TEXT")
    public String address;

    @NotNull(message = "Capacity is required")
    @Column(nullable = false)
    public Integer capacity;

    @Column(name = "current_stock")
    public Integer currentStock = 0;

    @Column(name = "created_at", updatable = false)
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
