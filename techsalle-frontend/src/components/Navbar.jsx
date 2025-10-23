import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          TechSalle
        </Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/" className="nav-link">
          Inicio
        </Link>
        <Link to="/product/new" className="nav-link">
          Nuevo Producto
        </Link>
        <Link to="/categories" className="nav-link">
          Categorías
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
