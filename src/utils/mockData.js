// src/utils/mockData.js
/**
 * Este archivo contiene datos simulados para usar en modo offline
 * o cuando hay problemas de conexión con el backend
 */

// Usuario simulado
export const mockUser = {
    _id: 'mock-user-123',
    username: 'usuario_demo',
    email: 'usuario@ejemplo.com',
    firstName: 'Usuario',
    lastName: 'Demo',
    phone: '5551234567',
    mfaEnabled: false
  };
  
  // Productos simulados
  export const mockProducts = [
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
    }
  ];
  
  // Órdenes simuladas
  export const mockOrders = [
    {
      _id: "ORD-10001",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      user: mockUser._id,
      totalPrice: 15799.97,
      status: "Entregado",
      isPaid: true,
      isDelivered: true,
      paymentMethod: "card",
      shippingAddress: {
        street: "Av. Principal 123",
        city: "Querétaro",
        state: "Querétaro",
        zipCode: "76000",
        country: "México"
      },
      items: 3,
      orderItems: [
        {_id: '1', name: 'Rifle de caza XH-200', quantity: 1, price: 11699.99, image: '/rifle.webp'},
        {_id: '2', name: 'Mira telescópica HD', quantity: 1, price: 2499.99, image: '/mira_telescopica.webp'},
        {_id: '3', name: 'Kit de limpieza para rifle', quantity: 1, price: 599.99, image: '/kit.jpg'}
      ]
    },
    {
      _id: "ORD-10002",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      user: mockUser._id,
      totalPrice: 2499.99,
      status: "Enviado",
      isPaid: true,
      isDelivered: false,
      paymentMethod: "paypal",
      shippingAddress: {
        street: "Calle Secundaria 456",
        city: "Querétaro",
        state: "Querétaro",
        zipCode: "76010",
        country: "México"
      },
      items: 1,
      orderItems: [
        {_id: '1', name: 'Chaqueta Camuflaje Premium', quantity: 1, price: 2499.99, image: '/chaqueta.jpeg'}
      ]
    },
    {
      _id: "ORD-10003",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      user: mockUser._id,
      totalPrice: 899.99,
      status: "Procesado",
      isPaid: false,
      isDelivered: false,
      paymentMethod: "card",
      shippingAddress: {
        street: "Av. Principal 123",
        city: "Querétaro",
        state: "Querétaro",
        zipCode: "76000",
        country: "México"
      },
      items: 1,
      orderItems: [
        {_id: '3', name: 'Kit de Carnada Profesional', quantity: 1, price: 899.99, image: '/kit_carnada.jpeg'}
      ]
    }
  ];
  
  // Direcciones simuladas
  export const mockAddresses = [
    {
      id: 1,
      type: 'shipping',
      isDefault: true,
      street: 'Av. Principal 123',
      city: 'Querétaro',
      state: 'Querétaro',
      zipCode: '76000',
      country: 'México'
    },
    {
      id: 2,
      type: 'billing',
      isDefault: true,
      street: 'Calle Fiscal 789',
      city: 'Querétaro',
      state: 'Querétaro',
      zipCode: '76010',
      country: 'México'
    }
  ];
  
  // Notificaciones simuladas
  export const mockNotifications = [
    {
      id: Date.now() - 1000000,
      message: '¡Bienvenido a Hunter\'s Candy! Explora nuestros productos destacados.',
      time: new Date(Date.now() - 1000000).toLocaleTimeString(),
      read: false,
      type: 'welcome'
    },
    {
      id: Date.now() - 2000000,
      message: 'Tu orden ORD-10001 ha cambiado a estado: Entregado',
      time: new Date(Date.now() - 2000000).toLocaleTimeString(),
      read: true,
      type: 'order'
    },
    {
      id: Date.now() - 3000000,
      message: '¡Stock bajo! Solo quedan 5 unidades de Mira Telescópica HD.',
      time: new Date(Date.now() - 3000000).toLocaleTimeString(),
      read: false,
      type: 'stock',
      productId: '5'
    }
  ];
  
  // Generar orden simulada
  export const generateMockOrder = (orderData) => {
    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    
    return {
      _id: orderId,
      createdAt: new Date().toISOString(),
      user: mockUser._id,
      orderItems: orderData.orderItems || [],
      shippingAddress: orderData.shippingAddress || mockAddresses[0],
      paymentMethod: orderData.paymentMethod || 'card',
      itemsPrice: orderData.itemsPrice || 0,
      taxPrice: orderData.taxPrice || 0,
      shippingPrice: orderData.shippingPrice || 0,
      discountAmount: orderData.discountAmount || 0,
      totalPrice: orderData.totalPrice || 0,
      couponCode: orderData.couponCode || '',
      status: 'Procesado',
      isPaid: false,
      isDelivered: false,
      offline: true
    };
  };
  
  // Función para añadir o actualizar un producto simulado en el carrito
  export const mockAddToCart = (product, quantity) => {
    // Obtener el carrito actual o crear uno nuevo
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Buscar si el producto ya está en el carrito
    const existingItemIndex = cart.findIndex(item => item.id === product._id);
    
    if (existingItemIndex >= 0) {
      // Actualizar la cantidad
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Añadir nuevo producto
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price * (1 - (product.discount || 0) / 100),
        image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg',
        quantity,
        stock: product.stock
      });
    }
    
    // Guardar el carrito actualizado
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return cart;
  };
  
  // Activar o desactivar modo offline
  export const toggleOfflineMode = (enable = null) => {
    const currentState = localStorage.getItem('offlineMode') === 'true';
    const newState = enable !== null ? enable : !currentState;
    
    localStorage.setItem('offlineMode', newState.toString());
    console.log(`Modo offline ${newState ? 'activado' : 'desactivado'}`);
    
    return newState;
  };
  
  // Verificar si el modo offline está activo
  export const isOfflineMode = () => {
    return localStorage.getItem('offlineMode') === 'true' || 
           process.env.REACT_APP_FORCE_OFFLINE === 'true';
  };
  
  // Exportar utilidades básicas para manejo de datos offline
  export default {
    mockUser,
    mockProducts,
    mockOrders,
    mockAddresses,
    mockNotifications,
    generateMockOrder,
    mockAddToCart,
    toggleOfflineMode,
    isOfflineMode
  };