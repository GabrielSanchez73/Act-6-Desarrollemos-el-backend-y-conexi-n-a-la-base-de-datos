const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateCategories() {
    let connection;
    
    try {
        // Conectar a la base de datos
        connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '', // Cambia esto por tu contraseña de MySQL si es necesario
            database: 'sistema_productos'
        });

        console.log('Conectado a la base de datos');

        // Crear tabla de categorías
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS categorias (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL UNIQUE,
                descripcion TEXT,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Tabla categorias creada/verificada');

        // Obtener categorías únicas de productos
        const [categories] = await connection.execute(`
            SELECT DISTINCT categoria FROM productos WHERE categoria IS NOT NULL AND categoria != ''
        `);

        console.log('Categorías encontradas:', categories.map(c => c.categoria));

        // Insertar categorías
        for (const cat of categories) {
            try {
                await connection.execute(`
                    INSERT IGNORE INTO categorias (nombre, descripcion) VALUES (?, ?)
                `, [cat.categoria, `Categoría: ${cat.categoria}`]);
                console.log(`Categoría insertada: ${cat.categoria}`);
            } catch (err) {
                if (err.code !== 'ER_DUP_ENTRY') {
                    console.error(`Error insertando categoría ${cat.categoria}:`, err.message);
                }
            }
        }

        // Agregar columna categoria_id si no existe
        try {
            await connection.execute(`
                ALTER TABLE productos ADD COLUMN categoria_id INT
            `);
            console.log('Columna categoria_id agregada');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Columna categoria_id ya existe');
            } else {
                console.error('Error agregando columna:', err.message);
            }
        }

        // Actualizar productos con categoria_id
        const [updateResult] = await connection.execute(`
            UPDATE productos p 
            JOIN categorias c ON p.categoria = c.nombre 
            SET p.categoria_id = c.id
        `);

        console.log(`Productos actualizados: ${updateResult.affectedRows}`);

        // Crear índice
        try {
            await connection.execute(`
                CREATE INDEX idx_categoria_id ON productos(categoria_id)
            `);
            console.log('Índice creado');
        } catch (err) {
            if (err.code === 'ER_DUP_KEYNAME') {
                console.log('Índice ya existe');
            } else {
                console.error('Error creando índice:', err.message);
            }
        }

        console.log('Migración completada exitosamente');

    } catch (error) {
        console.error('Error durante la migración:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

migrateCategories();
