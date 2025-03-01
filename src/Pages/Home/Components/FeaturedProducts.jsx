import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  // Mock data para productos destacados
  const featuredProducts = [
    {
      id: 1,
      name: "Rifle de caza XH-200",
      image: "/images/products/rifle-caza.jpg",
      price: 12999.99,
      description: "Rifle de alto rendimiento con mira telescópica incluida"
    },
    {
      id: 2,
      name: "Chaqueta Camuflaje Premium",
      image: "/images/products/chaqueta-camuflaje.jpg",
      price: 2499.99,
      description: "Chaqueta resistente al agua con patrón de camuflaje forestal"
    },
    {
      id: 3,
      name: "Kit de Carnada Profesional",
      image: "/images/products/kit-carnada.jpg",
      price: 899.99,
      description: "Set completo con diferentes tipos de carnada para diversos animales"
    },
    {
      id: 4,
      name: "Botas de Caza Impermeables",
      image: "/images/products/botas-caza.jpg",
      price: 1899.99,
      description: "Botas de alta resistencia con suela antideslizante para terrenos difíciles"
    }
  ];

  const handleAddToCart = (product) => {
    // Aquí iría la lógica para añadir al carrito
    console.log('Añadir al carrito:', product);
    alert(`${product.name} añadido al carrito`);
  };

  return (
    <section className="section-container featured-products">
      <h2>Productos Destacados</h2>
      <div className="products-grid">
        {featuredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <div className="product-actions">
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Añadir al carrito
                </button>
                <Link to={`/inventory/${product.id}`} className="view-details-btn">
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="view-all-container">
        <Link to="/inventory" className="view-all-btn">
          Ver todos los productos
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;