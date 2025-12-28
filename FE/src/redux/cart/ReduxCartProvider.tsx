import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, addToCartLocal, removeFromCartLocal, updateQuantityLocal, clearCartLocal } from './action';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const ReduxCartContext = createContext<CartContextType | undefined>(undefined);

export const ReduxCartProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state: { cart?: CartState }) => state.cart || { items: [], totalItems: 0, totalPrice: 0 });

  useEffect(() => {
    // Fetch cart on mount if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch(addToCartLocal(item));
  };

  const removeFromCart = (id: string) => {
    dispatch(removeFromCartLocal(id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantityLocal(id, quantity));
  };

  const clearCart = () => {
    dispatch(clearCartLocal());
  };

  return (
    <ReduxCartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </ReduxCartContext.Provider>
  );
};

export const useReduxCart = () => {
  const context = useContext(ReduxCartContext);
  if (!context) {
    throw new Error('useReduxCart must be used within ReduxCartProvider');
  }
  return context;
};

// Cart context is now exported from the provider, store export removed

