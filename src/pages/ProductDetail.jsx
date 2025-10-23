import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getById(id);
      setProduct(data);
    } catch (error) {
      setError('Error al cargar el producto');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productsAPI.delete(id);
        navigate('/');
      } catch (error) {
        setError('Error al eliminar el producto');
        console.error('Error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error">
        <p>Producto no encontrado</p>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          ← Volver
        </button>
        <h1>{product.name}</h1>
      </div>

      <div className="detail-content">
        <div className="product-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <div className="no-image">Sin imagen</div>
          )}
        </div>

        <div className="product-info">
          <div className="info-section">
            <h2>Información del Producto</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Nombre:</label>
                <span>{product.name}</span>
              </div>
              <div className="info-item">
                <label>Categoría:</label>
                <span>{product.category || 'Sin categoría'}</span>
              </div>
              <div className="info-item">
                <label>Precio:</label>
                <span className="price">${product.price}</span>
              </div>
              <div className="info-item">
                <label>Stock:</label>
                <span className={`stock ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
                  {product.stock} unidades
                </span>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="info-section">
              <h2>Descripción</h2>
              <p className="description">{product.description}</p>
            </div>
          )}

          <div className="detail-actions">
            <button
              onClick={() => navigate(`/product/edit/${product.id}`)}
              className="btn btn-primary"
            >
              Editar Producto
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Eliminar Producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
