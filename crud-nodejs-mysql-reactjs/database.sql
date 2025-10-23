-- Script para crear la base de datos del sistema de gestión de productos
-- Ejecutar en MySQL

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS sistema_productos;
USE sistema_productos;

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    proveedor VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria, stock, proveedor) VALUES
('Laptop HP Pavilion', 'Laptop HP Pavilion 15" con procesador Intel i5', 899.99, 'Electronicos', 10, 'HP Inc.'),
('Mouse Inalambrico Logitech', 'Mouse optico inalambrico con sensor de alta precision', 25.50, 'Accesorios', 50, 'Logitech'),
('Teclado Mecanico Corsair', 'Teclado mecanico RGB con switches Cherry MX', 89.99, 'Accesorios', 15, 'Corsair'),
('Monitor Samsung 24"', 'Monitor LED Full HD 1920x1080', 199.99, 'Monitores', 8, 'Samsung'),
('Disco Duro SSD 500GB', 'Disco de estado solido de alta velocidad', 79.99, 'Almacenamiento', 25, 'Western Digital'),
('Memoria RAM 16GB', 'Modulo de memoria DDR4 3200MHz', 89.99, 'Componentes', 12, 'Kingston'),
('Tarjeta Grafica RTX 3060', 'Tarjeta grafica NVIDIA RTX 3060 12GB', 399.99, 'Componentes', 5, 'NVIDIA'),
('Auriculares Gaming', 'Auriculares con microfono y sonido envolvente', 59.99, 'Accesorios', 30, 'HyperX');

-- Verificar datos insertados
SELECT * FROM productos;
