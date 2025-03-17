import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection = () => {
  const categories = [
    {
      id: 'armas',
      name: "Armas y Municiones",
      image: "/images/categories/armas.jpg",
      count: 24
    },
    {
      id: 'ropa',
      name: "Ropa Especializada",
      image: "/images/categories/ropa.jpg",
      count: 18
    },
    {
      id: 'carnada',
      name: "Carnada y Alimentos",
      image: "/images/categories/carnada.jpg",
      count: 30
    },
    {
      id: 'accesorios',
      name: "Accesorios y Herramientas",
      image: "/images/categories/accesorios.jpg",
      count: 15
    }
  ];

  return (
    <section className="section-container categories-section">
      <h2>Categorías</h2>
      <div className="categories-grid">
        {categories.map(category => (
          <Link 
            to={`/inventory?category=${category.id}`} 
            key={category.id} 
            className="category-card"
          >
            <div className="category-image">
              <img src={category.image} alt={category.name} />
            </div>
            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.count} productos</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;