import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../api/categories';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAll();
      setCategories(data);
    } catch (error) {
      setError('Error al cargar las categorías');
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

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
      } else {
        await categoriesAPI.create(formData);
      }

      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      setShowForm(false);
      loadCategories();
    } catch (error) {
      setError('Error al guardar la categoría');
      console.error('Error:', error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        await categoriesAPI.delete(categoryId);
        loadCategories();
      } catch (error) {
        setError('Error al eliminar la categoría');
        console.error('Error:', error);
      }
    }
  };

  const cancelForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
    setValidationErrors({});
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="categories">
      <div className="categories-header">
        <h1>Gestión de Categorías</h1>
        <Link to="/" className="btn btn-secondary">
          Volver al Inicio
        </Link>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="categories-content">
        <div className="categories-list">
          <div className="list-header">
            <h2>Categorías Existentes</h2>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Nueva Categoría
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="empty-state">
              <p>No hay categorías creadas</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                Crear primera categoría
              </button>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map(category => (
                <div key={category.id} className="category-card">
                  <h3>{category.name}</h3>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                  <div className="category-actions">
                    <button
                      onClick={() => handleEdit(category)}
                      className="btn btn-secondary btn-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <div className="category-form">
            <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre de la Categoría *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={validationErrors.name ? 'error' : ''}
                  placeholder="Ej: Smartphones"
                />
                {validationErrors.name && (
                  <span className="error-text">{validationErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción de la categoría..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </button>
                <button type="button" onClick={cancelForm} className="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
