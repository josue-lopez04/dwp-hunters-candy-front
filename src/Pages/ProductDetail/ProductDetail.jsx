import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';
import productService from '../../services/product.service';
import { useCart } from '../../context/CartContext';
import Navbar from '../../Components/Navbar/Navbar';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('No pudimos cargar los detalles del producto. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 10)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`Añadido al carrito: ${quantity} unidad(es) de ${product.name}`);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Cargando detalles del producto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <h2>Producto no encontrado</h2>
        <p>{error || 'Lo sentimos, el producto que estás buscando no está disponible.'}</p>
        <Link to="/inventory" className="back-to-shop-btn">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  // Calcular el precio final con descuento si existe
  const finalPrice = product.finalPrice || (product.price * (1 - (product.discount || 0) / 100));

  return (
    <div className="product-detail-page">
      <Navbar />
      <div className="product-detail-container">
        <div className="product-detail-breadcrumb">
          <Link to="/">Inicio</Link> &gt;
          <Link to="/inventory">Productos</Link> &gt;
          <span>{product.name}</span>
        </div>

        <div className="product-detail-main">
          <div className="product-gallery">
            <div className="product-main-image">
              <img 
                src={product.images && product.images.length > 0 
                  ? product.images[0] 
                  : "/images/placeholder.jpg"} 
                alt={product.name} 
              />
            </div>
            <div className="product-thumbnails">
              {product.images && product.images.map((image, index) => (
                <div key={index} className="product-thumbnail">
                  <img src={image} alt={`${product.name} - vista ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-pricing">
              {product.discount > 0 && (
                <span className="product-original-price">${product.price.toFixed(2)}</span>
              )}
              <span className="product-final-price">${finalPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="product-discount">-{product.discount}%</span>
              )}
            </div>

            <div className="product-stock">
              <span className={`stock-status ${product.stock > 5 ? 'in-stock' : 'low-stock'}`}>
                {product.stock > 0
                  ? `${product.stock > 5 ? 'En stock' : 'Pocas unidades'} (${product.stock} disponibles)`
                  : 'Agotado'}
              </span>
            </div>

            <div className="product-purchase">
              <div className="quantity-selector">
                <button
                  className="quantity-btn minus"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="quantity-input"
                  value={quantity}
                  min="1"
                  max={product.stock}
                  readOnly
                />
                <button
                  className="quantity-btn plus"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <i className="fa fa-shopping-cart"></i>
                Añadir al carrito
              </button>
            </div>

            <div className="product-short-description">
              <p>{product.description && product.description.substring(0, 150)}...</p>
            </div>

            <div className="product-meta">
              <div className="product-code">
                <span>Código: PRD-{product._id ? product._id.substring(0, 8) : ''}</span>
              </div>
              <div className="product-categories">
                <span>Categoría: </span>
                <Link to={`/inventory?category=${product.category}`}>{product.category}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="product-detail-tabs">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Descripción
            </button>
            <button
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Especificaciones
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reseñas ({product.reviews ? product.reviews.length : 0})
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'description' && (
              <div className="tab-content description-content">
                <p>{product.description}</p>
                <p>Este producto está diseñado para cazadores profesionales y aficionados que buscan alta precisión y fiabilidad en sus expediciones de caza. Fabricado con los mejores materiales y sometido a rigurosas pruebas de calidad para garantizar su rendimiento en las condiciones más exigentes.</p>
                <p>Incluye una garantía de 5 años del fabricante contra defectos de fabricación.</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="tab-content specifications-content">
                <table className="specs-table">
                  <tbody>
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <th>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="tab-content reviews-content">
                <div className="reviews-list">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map(review => (
                      <div key={review._id} className="review-item">
                        <div className="review-header">
                          <span className="review-author">{review.userName || 'Usuario'}</span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fa fa-star ${i < review.rating ? 'filled' : ''}`}
                              ></i>
                            ))}
                          </div>
                          <span className="review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="review-content">
                          <p>{review.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay reseñas para este producto todavía.</p>
                  )}
                </div>

                <div className="write-review">
                  <h3>Deja tu opinión</h3>
                  <form className="review-form">
                    <div className="rating-selector">
                      <span>Tu valoración:</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className="fa fa-star"></i>
                        ))}
                      </div>
                    </div>
                    <textarea
                      className="review-comment"
                      placeholder="Escribe tu opinión sobre este producto..."
                      rows="4"
                    ></textarea>
                    <button type="submit" className="submit-review-btn">
                      Enviar reseña
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Productos relacionados</h2>
            <div className="related-products-grid">
              {product.relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="related-product-card">
                  <div className="related-product-image">
                    <img src={relatedProduct.image} alt={relatedProduct.name} />
                  </div>
                  <div className="related-product-info">
                    <h3>{relatedProduct.name}</h3>
                    <p className="related-product-price">${relatedProduct.price.toFixed(2)}</p>
                    <Link to={`/inventory/${relatedProduct.id}`} className="view-product-btn">
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;