
const cartService = {
  // Obtener todos los items del carrito
  getCart: () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },
  

// Añadir un producto al carrito
addToCart: (product, quantity = 1) => {
  const cart = cartService.getCart();
  
  // Identificar el producto por _id (MongoDB) o id (local)
  const productId = product._id || product.id;
  
  // Buscar si el producto ya está en el carrito
  const existingItem = cart.find(item => (item.id === productId || item.id === product.id));
  
  // Stock después de añadir al carrito
  const newStock = product.stock - quantity;
  
  // Si el stock es bajo (5 o menos unidades) después de añadir al carrito
  if (newStock > 0 && newStock <= 5) {
    // Emitir evento de stock bajo si existe socket
    if (window.socket) {
      window.socket.emit('lowStock', {
        productId: productId,
        productName: product.name,
        stock: newStock
      });
    }
  }
  
  if (existingItem) {
    // Actualizar la cantidad si ya existe
    existingItem.quantity += quantity;
  } else {
    // Determinar el precio a usar (con descuento o normal)
    const price = product.finalPrice || (product.discount 
      ? product.price * (1 - product.discount / 100) 
      : product.price);
    
    // Determinar la imagen a usar
    const image = Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : (product.image || '/images/placeholder.jpg');
    
    // Añadir nuevo item al carrito
    cart.push({
      id: productId,
      name: product.name,
      price: Number(price.toFixed(2)),
      image: image,
      quantity,
      stock: product.stock
    });
  }
  
  // Guardar carrito actualizado
  localStorage.setItem('cart', JSON.stringify(cart));
  
  return cart;
},
  
  // Actualizar la cantidad de un producto en el carrito
  updateCartItemQuantity: (productId, quantity) => {
    const cart = cartService.getCart();
    
    // Buscar el producto en el carrito
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
      // Actualizar la cantidad
      cart[itemIndex].quantity = quantity;
      
      // Guardar carrito actualizado
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
  },
  
  // Eliminar un producto del carrito
  removeFromCart: (productId) => {
    let cart = cartService.getCart();
    
    // Filtrar para eliminar el producto
    cart = cart.filter(item => item.id !== productId);
    
    // Guardar carrito actualizado
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return cart;
  },
  
  // Vaciar el carrito
  clearCart: () => {
    localStorage.removeItem('cart');
    return [];
  },
  
  // Calcular el subtotal del carrito
  calculateSubtotal: (cart = null) => {
    const cartItems = cart || cartService.getCart();
    
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  // Aplicar cupón de descuento
  applyCoupon: async (couponCode, subtotal) => {
    try {
      // Esta función simula la validación del cupón en el servidor
      // En la implementación real, esto debería ser una llamada al API
      
      if (couponCode === 'HUNTER20') {
        const discountAmount = subtotal * 0.2; // 20% de descuento
        
        return {
          valid: true,
          discountAmount,
          message: 'Cupón aplicado correctamente: 20% de descuento'
        };
      } else if (couponCode === 'WELCOME10') {
        const discountAmount = subtotal * 0.1; // 10% de descuento
        
        return {
          valid: true,
          discountAmount,
          message: 'Cupón aplicado correctamente: 10% de descuento'
        };
      } else {
        throw new Error('Cupón inválido o expirado');
      }
    } catch (error) {
      throw error;
    }
  }
};

export default cartService;