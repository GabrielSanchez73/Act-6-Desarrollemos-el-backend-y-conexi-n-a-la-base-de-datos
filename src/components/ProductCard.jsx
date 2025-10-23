import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await onDelete(product.id);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="no-image">Sin imagen</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category || 'Sin categoría'}</p>
        <p className="product-description">{product.description}</p>
        
        <div className="product-details">
          <span className="product-price">${product.price}</span>
          <span className={`product-stock ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
            Stock: {product.stock}
          </span>
        </div>
        
        <div className="product-actions">
          <Link to={`/product/${product.id}`} className="btn btn-primary">
            Ver Detalle
          </Link>
          <Link to={`/product/edit/${product.id}`} className="btn btn-secondary">
            Editar
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
