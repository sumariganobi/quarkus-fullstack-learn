package com.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class WarehouseRequest {

    @NotBlank(message = "Warehouse name is required")
    public String name;

    @NotBlank(message = "Location is required")
    public String location;

    public String address;

    @NotNull(message = "Capacity is required")
    @PositiveOrZero(message = "Capacity must be zero or positive")
    public Integer capacity;

    @PositiveOrZero(message = "Current stock must be zero or positive")
    public Integer currentStock;
}
