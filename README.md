# TechSalle - Sistema de Gestión de Productos

Sistema completo de gestión de productos tecnológicos desarrollado con Node.js, MySQL y React.js.

## Características

### Frontend (React.js)
- **Home**: Listado de productos con filtros por categoría y búsqueda por nombre
- **Formulario de Producto**: Crear y editar productos con validación completa
- **Gestión de Categorías**: CRUD completo para categorías
- **Diseño Responsivo**: Adaptable a diferentes dispositivos
- **Estados de Carga**: Indicadores de carga, error y estados vacíos
- **Validación**: Inputs validados con mensajes de error claros
- **Imágenes**: Soporte para URLs de imágenes de productos

### Backend (Node.js + Express)
- **API RESTful**: Endpoints completos para productos y categorías
- **Base de Datos MySQL**: Gestión eficiente de datos
- **Validación**: Validación de datos en servidor
- **CORS**: Configurado para desarrollo frontend

## Tecnologías

### Frontend
- React 18
- Material-UI (MUI)
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- Dotenv

## Estructura del Proyecto

```
crud-nodejs-mysql-reactjs/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   └── CategoryManager.jsx
│   │   ├── App.js
│   │   ├── config.js
│   │   └── index.js
│   ├── package.json
│   └── public/
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── models/
│   ├── package.json
│   └── database.sql
├── iniciar.bat            # Script de inicio
└── README.md
```

## Instalación y Uso

### Requisitos Previos
- Node.js (v14 o superior)
- MySQL (v8 o superior)
- Git

### Instalación Rápida

1. **Clonar el repositorio**:
```bash
git clone https://github.com/GabrielSanchez73/Act-6-Desarrollemos-el-backend-y-conexi-n-a-la-base-de-datos.git
cd crud-nodejs-mysql-reactjs
```

2. **Ejecutar el sistema**:
```bash
# En Windows
iniciar.bat

# O manualmente:
cd server && npm install && npm start
cd client && npm install && npm start
```

3. **Acceder a la aplicación**:
- Frontend: http://localhost:4000
- Backend: http://localhost:5000

### Instalación Manual

#### Backend
```bash
cd server
npm install
# Configurar base de datos en database.sql
npm start
```

#### Frontend
```bash
cd client
npm install
npm start
```

## Base de Datos

### Configuración MySQL
1. Crear base de datos:
```sql
CREATE DATABASE techsalle;
```

2. Ejecutar el script `server/database.sql`

### Estructura de Tablas
- **productos**: id, nombre, descripcion, precio, categoria, stock, proveedor, imagenUrl
- **categorias**: id, nombre, descripcion

## Funcionalidades

### Gestión de Productos
- Listar productos con filtros
- Crear productos nuevos
- Editar productos existentes
- Eliminar productos
- Búsqueda por nombre
- Filtros por categoría y precio
- Soporte para imágenes

### Gestión de Categorías
- Listar categorías
- Crear categorías nuevas
- Editar categorías existentes
- Eliminar categorías
- Validación de campos

### Características Adicionales
- Diseño profesional con Material-UI
- Estados de carga y error
- Validación de formularios
- Notificaciones de éxito/error
- Responsive design
- Estadísticas en tiempo real

## API Endpoints

### Productos
- `GET /productos` - Listar productos
- `GET /productos/:id` - Obtener producto
- `POST /productos` - Crear producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto

### Categorías
- `GET /categorias` - Listar categorías
- `GET /categorias/:id` - Obtener categoría
- `POST /categorias` - Crear categoría
- `PUT /categorias/:id` - Actualizar categoría
- `DELETE /categorias/:id` - Eliminar categoría

### Estadísticas
- `GET /estadisticas` - Obtener estadísticas del sistema

## Diseño

- **Colores**: Paleta profesional con azules y grises
- **Tipografía**: Material-UI typography
- **Layout**: Grid responsivo
- **Interacciones**: Hover effects y transiciones suaves
- **Estados**: Loading spinners, mensajes claros

## Responsive Design

- **Desktop**: Layout completo con sidebar
- **Tablet**: Grid adaptativo
- **Mobile**: Una columna, navegación optimizada

## Scripts Disponibles

### Frontend
- `npm start` - Ejecutar en modo desarrollo (puerto 4000)
- `npm run build` - Construir para producción
- `npm test` - Ejecutar pruebas

### Backend
- `npm start` - Ejecutar servidor (puerto 5000)
- `npm run dev` - Ejecutar con nodemon

## Variables de Entorno

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=techsalle
PORT=5000
```

### Frontend
```
VITE_API_BASE_URL=http://localhost:5000
```

## Características Técnicas

- **Normalización**: Base de datos normalizada
- **Validación**: Validación en frontend y backend
- **Error Handling**: Manejo de errores completo
- **Performance**: Consultas optimizadas
- **Security**: Validación de datos y CORS

## Autor

**Gabriel Sánchez**
- GitHub: [@GabrielSanchez73](https://github.com/GabrielSanchez73)



**TechSalle** - Sistema de Gestión de Productos Tecnológicos
