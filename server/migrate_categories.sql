-- Script para crear tabla de categorías y migrar datos existentes
USE sistema_productos;

-- Crear la tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar categorías únicas de los productos existentes
INSERT IGNORE INTO categorias (nombre, descripcion) VALUES
('Accesorios', 'Accesorios para computadoras y dispositivos'),
('snacks', 'Productos alimenticios'),
('Almacenamiento', 'Discos duros y unidades de almacenamiento'),
('graficas', 'Tarjetas gráficas y componentes de video'),
('Electronicos', 'Dispositivos electrónicos'),
('Componentes', 'Componentes de computadora'),
('Monitores', 'Pantallas y monitores'),
('nevera', 'Electrodomésticos de refrigeración'),
('licuadora', 'Electrodomésticos de cocina');

-- Agregar columna categoria_id a la tabla productos si no existe
ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria_id INT;

-- Actualizar productos con el ID de categoría correspondiente
UPDATE productos p 
JOIN categorias c ON p.categoria = c.nombre 
SET p.categoria_id = c.id;

-- Crear índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_categoria_id ON productos(categoria_id);
