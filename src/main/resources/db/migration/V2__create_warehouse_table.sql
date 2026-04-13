-- Create warehouses table
CREATE TABLE warehouses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    capacity INT NOT NULL DEFAULT 0,
    current_stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO warehouses (name, location, address, capacity, current_stock) VALUES
('Warehouse Jakarta Utara', 'Jakarta', 'Jl. Pluit Raya No. 123, Jakarta Utara', 10000, 7500),
('Warehouse Surabaya', 'Surabaya', 'Jl. Rungkut Industri No. 45, Surabaya', 8000, 3200),
('Warehouse Bandung', 'Bandung', 'Jl. Soekarno Hatta No. 789, Bandung', 5000, 4800);
