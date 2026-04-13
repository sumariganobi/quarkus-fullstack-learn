package com.example.service;

import com.example.dto.WarehouseRequest;
import com.example.entity.Warehouse;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class WarehouseService {

    public List<Warehouse> getAllWarehouses() {
        return Warehouse.listAll();
    }

    public Warehouse getWarehouseById(Long id) {
        Warehouse warehouse = Warehouse.findById(id);
        if (warehouse == null) {
            throw new NotFoundException("Warehouse with id " + id + " not found");
        }
        return warehouse;
    }

    @Transactional
    public Warehouse createWarehouse(WarehouseRequest request) {
        Warehouse warehouse = new Warehouse();
        warehouse.name = request.name;
        warehouse.location = request.location;
        warehouse.address = request.address;
        warehouse.capacity = request.capacity;
        warehouse.currentStock = request.currentStock != null ? request.currentStock : 0;
        warehouse.persist();
        return warehouse;
    }

    @Transactional
    public Warehouse updateWarehouse(Long id, WarehouseRequest request) {
        Warehouse warehouse = getWarehouseById(id);
        warehouse.name = request.name;
        warehouse.location = request.location;
        warehouse.address = request.address;
        warehouse.capacity = request.capacity;
        warehouse.currentStock = request.currentStock != null ? request.currentStock : warehouse.currentStock;
        return warehouse;
    }

    @Transactional
    public void deleteWarehouse(Long id) {
        Warehouse warehouse = getWarehouseById(id);
        warehouse.delete();
    }

    public List<Warehouse> searchWarehousesByLocation(String location) {
        return Warehouse.list("LOWER(location) LIKE LOWER(?1)", "%" + location + "%");
    }

    public List<Warehouse> getAvailableWarehouses() {
        return Warehouse.list("currentStock < capacity");
    }
}
