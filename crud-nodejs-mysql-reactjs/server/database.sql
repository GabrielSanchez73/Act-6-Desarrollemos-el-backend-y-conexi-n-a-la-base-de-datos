-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_productos;
USE sistema_productos;

-- Crear la tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    proveedor VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar algunos productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria, stock, proveedor) VALUES
('Laptop HP Pavilion', 'Laptop de 15.6 pulgadas con procesador Intel i5', 899.99, 'Electrónicos', 25, 'HP Inc.'),
('Mouse Inalámbrico Logitech', 'Mouse ergonómico con sensor óptico de alta precisión', 29.99, 'Accesorios', 150, 'Logitech'),
('Monitor Samsung 24"', 'Monitor LED Full HD con tiempo de respuesta de 1ms', 199.99, 'Monitores', 30, 'Samsung'),
('Teclado Mecánico Corsair', 'Teclado gaming con switches Cherry MX Red', 149.99, 'Accesorios', 45, 'Corsair'),
('Auriculares Sony WH-1000XM4', 'Auriculares inalámbricos con cancelación de ruido', 349.99, 'Audio', 20, 'Sony'),
('SSD Samsung 1TB', 'Disco de estado sólido con velocidad de lectura de 3500MB/s', 129.99, 'Almacenamiento', 60, 'Samsung'),
('Webcam Logitech C920', 'Webcam HD con micrófono integrado', 79.99, 'Accesorios', 80, 'Logitech'),
('Impresora HP LaserJet', 'Impresora láser monocromática para oficina', 299.99, 'Impresoras', 15, 'HP Inc.');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_nombre ON productos(nombre);
CREATE INDEX idx_categoria ON productos(categoria);
CREATE INDEX idx_precio ON productos(precio);
CREATE INDEX idx_stock ON productos(stock);
