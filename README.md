# TechSalle Frontend

Frontend de React.js para el sistema de gestión de productos tecnológicos TechSalle.

## Características

- Home con listado de productos y filtros por categoría y búsqueda por nombre
- Formulario de producto para crear y editar con validación completa
- Detalle de producto con información completa
- Eliminar producto desde la lista o el detalle
- Gestión de categorías para crear, editar y eliminar
- Diseño responsivo adaptable a diferentes dispositivos
- Estados de carga, error y vacíos claros
- Validación de inputs con mensajes de error claros

## Tecnologías

- React 19
- React Router DOM
- Axios
- Vite
- CSS3

## Estructura del Proyecto

```
src/
├── api/
│   ├── products.js      # Servicios API para productos
│   └── categories.js    # Servicios API para categorías
├── components/
│   ├── ProductCard.jsx  # Tarjeta de producto
│   ├── Filters.jsx      # Componente de filtros
│   └── Navbar.jsx       # Barra de navegación
├── pages/
│   ├── Home.jsx         # Página principal
│   ├── ProductForm.jsx  # Formulario crear/editar producto
│   ├── ProductDetail.jsx # Detalle de producto
│   └── Categories.jsx   # Gestión de categorías
├── App.jsx              # Componente principal con routing
├── main.jsx             # Punto de entrada
├── App.css              # Estilos principales
└── index.css            # Estilos globales
```

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd techsalle-frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp env.example .env
   ```
   
   Editar .env y configurar:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```

5. Abrir en el navegador:
   ```
   http://localhost:5173
   ```

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción

## Funcionalidades

### Home
- Listado de productos en grid responsivo
- Filtros por categoría con dropdown
- Búsqueda por nombre con debounce (300ms)
- Botones de acción: Ver detalle, Editar, Eliminar
- Estados de carga y vacío

### Formulario de Producto
- Campos: nombre, precio, stock, categoría, imagen URL, descripción
- Validación en tiempo real
- Precio debe ser mayor a 0
- Stock debe ser mayor o igual a 0
- Nombre y categoría obligatorios
- Modo crear y editar

### Detalle de Producto
- Información completa del producto
- Imagen del producto
- Botones de acción: Editar, Eliminar
- Confirmación antes de eliminar

### Gestión de Categorías
- Lista de categorías existentes
- Formulario para crear/editar categorías
- Eliminación con confirmación
- Validación de campos obligatorios

## API Endpoints Requeridos

El frontend espera que el backend tenga los siguientes endpoints:

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

## Diseño

- Colores: Paleta profesional con azules y grises
- Tipografía: Segoe UI para mejor legibilidad
- Layout: Grid responsivo para productos
- Interacciones: Hover effects y transiciones suaves
- Estados: Loading spinners, mensajes de error claros

## Responsive Design

- Desktop: Grid de 3-4 columnas para productos
- Tablet: Grid de 2 columnas
- Mobile: Una columna, navegación apilada
- Breakpoint: 768px para cambios principales

## Autor

Gabriel Sánchez
