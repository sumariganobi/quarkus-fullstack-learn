package com.example.service;

import com.example.dto.ProductRequest;
import com.example.entity.Product;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class ProductService {

    public List<Product> getAllProducts() {
        return Product.listAll();
    }

    public Product getProductById(Long id) {
        Product product = Product.findById(id);
        if (product == null) {
            throw new NotFoundException("Product with id " + id + " not found");
        }
        return product;
    }

    @Transactional
    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.name = request.name;
        product.description = request.description;
        product.price = request.price;
        product.stock = request.stock;
        product.persist();
        return product;
    }

    @Transactional
    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        product.name = request.name;
        product.description = request.description;
        product.price = request.price;
        product.stock = request.stock;
        return product;
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.delete();
    }

    public List<Product> searchProductsByName(String name) {
        return Product.list("LOWER(name) LIKE LOWER(?1)", "%" + name + "%");
    }
}
