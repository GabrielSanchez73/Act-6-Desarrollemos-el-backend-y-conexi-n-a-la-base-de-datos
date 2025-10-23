import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';
import { categoriesAPI } from '../api/categories';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: '',
    description: '',
    supplier: '',
    newCategory: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadProduct();
    }
  }, [id, isEdit]);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await productsAPI.getById(id);
      setFormData({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        description: product.description || '',
        supplier: product.supplier || ''
      });
    } catch (error) {
      setError('Error al cargar el producto');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'El precio debe ser mayor a 0';
    }

    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      errors.stock = 'El stock debe ser mayor o igual a 0';
    }

    if (!formData.category_id) {
      errors.category_id = 'Debe seleccionar una categoría';
    } else if (formData.category_id === 'new' && !formData.newCategory?.trim()) {
      errors.category_id = 'Debe ingresar el nombre de la nueva categoría';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let categoryId = formData.category_id;

      // Si se seleccionó "Agregar nueva categoría", crearla primero
      if (formData.category_id === 'new' && formData.newCategory.trim()) {
        try {
          const newCategory = await categoriesAPI.create({ name: formData.newCategory.trim() });
          categoryId = newCategory.id;
          // Recargar categorías para incluir la nueva
          loadCategories();
        } catch (categoryError) {
          setError('Error al crear la nueva categoría');
          console.error('Error creando categoría:', categoryError);
          return;
        }
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoria_id: parseInt(categoryId)
      };

      if (isEdit) {
        await productsAPI.update(id, productData);
      } else {
        await productsAPI.create(productData);
      }

      navigate('/');
    } catch (error) {
      setError('Error al guardar el producto');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="product-form">
      <div className="form-header">
        <h1>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h1>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          Volver
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Nombre del Producto *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={validationErrors.name ? 'error' : ''}
            placeholder="Ej: iPhone 15 Pro"
          />
          {validationErrors.name && (
            <span className="error-text">{validationErrors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="price">Precio *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={validationErrors.price ? 'error' : ''}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {validationErrors.price && (
            <span className="error-text">{validationErrors.price}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="stock">Stock *</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className={validationErrors.stock ? 'error' : ''}
            placeholder="0"
            min="0"
          />
          {validationErrors.stock && (
            <span className="error-text">{validationErrors.stock}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="category_id">Categoría *</label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className={validationErrors.category_id ? 'error' : ''}
          >
            <option value="">Seleccionar categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
            <option value="new">Agregar nueva categoría</option>
          </select>
          {validationErrors.category_id && (
            <span className="error-text">{validationErrors.category_id}</span>
          )}
          {formData.category_id === 'new' && (
            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Nueva categoría"
                value={formData.newCategory || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, newCategory: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image_url">URL de Imagen</label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="supplier">Proveedor</label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            placeholder="Nombre del proveedor"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descripción del producto..."
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
