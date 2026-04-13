package com.example.dto;

import com.example.entity.Warehouse;

import java.time.LocalDateTime;

public class WarehouseResponse {

    public Long id;
    public String name;
    public String location;
    public String address;
    public Integer capacity;
    public Integer currentStock;
    public Integer availableSpace;
    public Double utilizationPercentage;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public WarehouseResponse() {
    }

    public WarehouseResponse(Warehouse warehouse) {
        this.id = warehouse.id;
        this.name = warehouse.name;
        this.location = warehouse.location;
        this.address = warehouse.address;
        this.capacity = warehouse.capacity;
        this.currentStock = warehouse.currentStock;
        this.availableSpace = warehouse.capacity - warehouse.currentStock;
        this.utilizationPercentage = warehouse.capacity > 0 
            ? (warehouse.currentStock * 100.0) / warehouse.capacity 
            : 0.0;
        this.createdAt = warehouse.createdAt;
        this.updatedAt = warehouse.updatedAt;
    }
}
