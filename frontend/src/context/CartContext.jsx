import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodly_cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("foodly_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food) => {
    setCart((current) => {
      const found = current.find((item) => item.id === food.id);
      if (found) {
        return current.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...food, quantity: 1 }];
    });
  };

  const decrease = (id) => {
    setCart((current) =>
      current
        .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => setCart((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setCart([]);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider value={{
      cart, addToCart, decrease, removeFromCart, clearCart,
      totalItems, subtotal, deliveryFee, total
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);