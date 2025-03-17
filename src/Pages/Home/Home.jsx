import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import HeroBanner from './Components/HeroBanner';
import FeaturedProducts from './Components/FeaturedProducts';
import CategorySection from './Components/CategorySection';
import Navbar from '../../Components/Navbar/Navbar';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <HeroBanner />

      <section className="section-container welcome-section">
        <h2>¿Quiénes Somos?</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Hunter's Candy es tu tienda en línea especializada en productos para la caza legal
              y actividades al aire libre. Ofrecemos una amplia selección de equipamiento para cazadores,
              tanto principiantes como experimentados.
            </p>
            <p>
              Nos especializamos en brindar los mejores productos para caza, equipo de camping,
              alimentos de carnada, ropa especializada y herramientas de alta calidad para garantizar
              una experiencia exitosa.
            </p>
            <p>
              Todos nuestros productos son cuidadosamente seleccionados para garantizar
              la mejor calidad y durabilidad. En Hunter's Candy encontrarás desde equipamiento básico
              hasta productos especializados para cazadores experimentados y mucho mas.
            </p>
          </div>
          <div className="about-image">
            <img src="/logo.jpeg" alt="Hunter's Candy Store" />
          </div>
        </div>
      </section>


      <section className="section-container cta-section">
        <div className="cta-content">
          <h2>¿Listo para tu próxima aventura?</h2>
          <p>Explora nuestra amplia variedad de productos y encuentra todo lo que necesitas para tu próxima expedición.</p>
          <Link to="/inventory" className="cta-button">
            Ver catálogo completo
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;