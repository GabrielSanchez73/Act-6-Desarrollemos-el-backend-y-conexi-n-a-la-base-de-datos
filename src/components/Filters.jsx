import React, { useState, useEffect } from 'react';

const Filters = ({ categories, onFilterChange, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearchChange]);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    onFilterChange(categoryId);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    onSearchChange('');
    onFilterChange('');
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="search">Buscar producto:</label>
        <input
          type="text"
          id="search"
          placeholder="Nombre del producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Categoría:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="">Todas las categorías</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={clearFilters} className="btn btn-secondary">
        Limpiar Filtros
      </button>
    </div>
  );
};

export default Filters;
