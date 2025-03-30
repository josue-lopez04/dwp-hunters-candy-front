import axios from 'axios';

// Crear una instancia de axios con la URL base

const API_URL = `${process.env.REACT_APP_API_URL}/products` || 'http://localhost:5000/api/products';

// Configuración de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token a las peticiones autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Productos de ejemplo para cuando la API no esté disponible
const exampleProducts = [
  {
    _id: "1",
    name: "Rifle de caza XH-200",
    description: "Rifle de alto rendimiento con mira telescópica incluida. Excelente para caza mayor y tiro deportivo. Fabricado con materiales de la más alta calidad.",
    price: 12999.99,
    discount: 10,
    category: "armas",
    stock: 15,
    images: ["/rifle.webp", "/rifle2.jpeg", "/rifle3.jpeg"],
    rating: 4.8,
    numReviews: 24,
    featured: true
  },
  {
    _id: "2",
    name: "Chaqueta Camuflaje Premium",
    description: "Chaqueta resistente al agua con patrón de camuflaje forestal. Perfecta para mantener el calor y la sequedad durante largas jornadas de caza.",
    price: 2499.99,
    discount: 0,
    category: "ropa",
    stock: 8,
    images: ["/chaqueta.jpeg"],
    rating: 4.5,
    numReviews: 18,
    featured: true
  },
  {
    _id: "3",
    name: "Kit de Carnada Profesional",
    description: "Set completo con diferentes tipos de carnada para diversos animales. Incluye atrayentes sintéticos y naturales de alta efectividad.",
    price: 899.99,
    discount: 15,
    category: "carnada",
    stock: 30,
    images: ["/kit_carnada.jpeg"],
    rating: 4.2,
    numReviews: 42,
    featured: true
  },
  {
    _id: "4",
    name: "Botas de Caza Impermeables",
    description: "Botas de alta resistencia con suela antideslizante para terrenos difíciles. Diseñadas para proporcionar máxima comodidad y protección.",
    price: 1899.99,
    discount: 0,
    category: "ropa",
    stock: 12,
    images: ["/botas_impermeable.webp"],
    rating: 4.7,
    numReviews: 33,
    featured: false
  },
  {
    _id: "5",
    name: "Mira Telescópica HD 4-16x50mm",
    description: "Mira telescópica de alta definición con zoom de 4x a 16x. Perfecta para tiros de larga distancia con claridad excepcional y ajustes precisos.",
    price: 4999.99,
    discount: 5,
    category: "accesorios",
    stock: 5,
    images: ["/mira_telescopica.webp"],
    rating: 4.9,
    numReviews: 28,
    featured: false
  },
  {
    _id: "6",
    name: "Kit de Limpieza para Rifles",
    description: "Kit completo para la limpieza y mantenimiento de rifles. Incluye todos los implementos necesarios para mantener tu arma en perfectas condiciones.",
    price: 599.99,
    discount: 0,
    category: "accesorios",
    stock: 25,
    images: ["/kit.jpg"],
    rating: 4.3,
    numReviews: 47,
    featured: false
  },
  {
    _id: "7",
    name: "Munición Premium .308",
    description: "Caja de munición calibre .308 de alta precisión. Diseñada para máxima precisión y consistencia en cada disparo.",
    price: 799.99,
    discount: 0,
    category: "armas",
    stock: 50,
    images: ["/balas.webp"],
    rating: 4.6,
    numReviews: 31,
    featured: false
  },
  {
    _id: "8",
    name: "Tienda de Campaña Camuflaje",
    description: "Tienda de campaña resistente con patrón de camuflaje. Perfecta para acampar durante expediciones de caza de varios días.",
    price: 3499.99,
    discount: 10,
    category: "accesorios",
    stock: 3,
    images: ["/campaña.jpeg"],
    rating: 4.4,
    numReviews: 19,
    featured: false
  }
];

// Función para filtrar y entregar datos de ejemplo
const getExampleProducts = (filters = {}) => {
  const { category, minPrice, maxPrice, keyword, sortBy } = filters;
  
  // Filtrar productos
  let filteredProducts = [...exampleProducts];
  
  // Filtrar por categoría
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(
      product => product.category === category
    );
  }
  
  // Filtrar por precio
  if (minPrice || maxPrice) {
    filteredProducts = filteredProducts.filter(
      product => {
        const finalPrice = product.price * (1 - (product.discount || 0) / 100);
        return (
          (!minPrice || finalPrice >= minPrice) && 
          (!maxPrice || finalPrice <= maxPrice)
        );
      }
    );
  }
  
  // Filtrar por palabra clave
  if (keyword) {
    const searchTerm = keyword.toLowerCase();
    filteredProducts = filteredProducts.filter(
      product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Ordenar productos
  if (sortBy) {
    switch (sortBy) {
      case 'price-asc':
        filteredProducts.sort((a, b) => {
          const priceA = a.price * (1 - (a.discount || 0) / 100);
          const priceB = b.price * (1 - (b.discount || 0) / 100);
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => {
          const priceA = a.price * (1 - (a.discount || 0) / 100);
          const priceB = b.price * (1 - (b.discount || 0) / 100);
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Por defecto, mostrar destacados primero
        filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
  }
  
  // Calcular precio con descuento para cada producto
  filteredProducts = filteredProducts.map(product => {
    const finalPrice = product.price * (1 - (product.discount || 0) / 100);
    return {
      ...product,
      finalPrice: parseFloat(finalPrice.toFixed(2))
    };
  });
  
  // Formato similar a la respuesta del backend
  return {
    products: filteredProducts,
    page: 1,
    pages: 1,
    totalProducts: filteredProducts.length
  };
};

// Servicio de productos
const productService = {
  // Obtener todos los productos con filtros opcionales
  getProducts: async (filters = {}) => {
    try {
      const { category, minPrice, maxPrice, keyword, sortBy, page = 1 } = filters;
      
      let url = '?';
      
      if (category && category !== 'all') {
        url += `category=${category}&`;
      }
      
      if (minPrice) {
        url += `minPrice=${minPrice}&`;
      }
      
      if (maxPrice) {
        url += `maxPrice=${maxPrice}&`;
      }
      
      if (keyword) {
        url += `keyword=${keyword}&`;
      }
      
      if (sortBy) {
        url += `sortBy=${sortBy}&`;
      }
      
      url += `page=${page}`;
      
      const response = await api.get(url);
      
      // Si hay un error en la API, usar datos simulados
      if (!response.data || (response.data && !response.data.products && !Array.isArray(response.data))) {
        console.log('Usando datos de ejemplo debido a respuesta incompleta');
        return getExampleProducts(filters);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      // Retornar productos de ejemplo en caso de error
      return getExampleProducts(filters);
    }
  },
  
  // Obtener un producto por ID
  getProductById: async (productId) => {
    try {
      const response = await api.get(`/${productId}`);
      
      // Asegurar que el producto tenga un precio con descuento calculado
      const product = response.data;
      if (product && !product.finalPrice && product.discount > 0) {
        product.finalPrice = Number((product.price * (1 - product.discount / 100)).toFixed(2));
      }
      
      return product;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      
      // Buscar en los datos de ejemplo si hay error
      const exampleProduct = exampleProducts.find(p => p._id === productId);
      if (exampleProduct) {
        // Calcular precio final con descuento si existe
        const finalPrice = exampleProduct.price * (1 - (exampleProduct.discount || 0) / 100);
        
        // Crear productos relacionados simulados
        const relatedProducts = exampleProducts
          .filter(p => p.category === exampleProduct.category && p._id !== exampleProduct._id)
          .slice(0, 4)
          .map(p => ({
            id: p._id,
            name: p.name,
            price: p.price,
            image: p.images[0],
            finalPrice: p.price * (1 - (p.discount || 0) / 100)
          }));
        
        return {
          ...exampleProduct,
          finalPrice: parseFloat(finalPrice.toFixed(2)),
          relatedProducts
        };
      }
      
      throw new Error('Producto no encontrado');
    }
  },
  
  // Obtener productos destacados
  getFeaturedProducts: async (limit = 4) => {
    try {
      const response = await api.get(`/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos destacados:', error);
      // Retornar productos destacados de ejemplo
      const featured = exampleProducts
        .filter(p => p.featured)
        .slice(0, limit)
        .map(p => ({
          ...p,
          finalPrice: parseFloat((p.price * (1 - (p.discount || 0) / 100)).toFixed(2))
        }));
      return featured;
    }
  },
  
  // Obtener productos por categoría
  getProductsByCategory: async (category, limit = 8) => {
    try {
      const response = await api.get(`/category/${category}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      // Retornar productos por categoría de ejemplo
      const filtered = exampleProducts
        .filter(p => p.category === category)
        .slice(0, limit)
        .map(p => ({
          ...p,
          finalPrice: parseFloat((p.price * (1 - (p.discount || 0) / 100)).toFixed(2))
        }));
      return filtered;
    }
  },
  
  // Crear una reseña para un producto
  createProductReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error al crear reseña:', error);
      throw error.response ? error.response.data : new Error('Error al crear la reseña');
    }
  }
};

export default productService;