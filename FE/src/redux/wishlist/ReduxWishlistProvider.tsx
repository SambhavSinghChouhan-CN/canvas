import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSelector, useDispatch, Provider } from 'react-redux';
import { fetchWishlist, addToWishlist, removeFromWishlist } from './action';
import store from './store';

export interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    stock: number;
    price: number;
    discount: number;
    category: {
      id: number;
      name: string;
    };
  };
}

interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
  addingToWishlist: boolean;
  removingFromWishlist: boolean;
  error: string | null;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  addingToWishlist: boolean;
  removingFromWishlist: boolean;
  error: string | null;
  fetchWishlist: () => void;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
}

const ReduxWishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const ReduxWishlistProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <WishlistContextProvider>
        {children}
      </WishlistContextProvider>
    </Provider>
  );
};

const WishlistContextProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { wishlist = [], loading = false, addingToWishlist = false, removingFromWishlist = false, error = null } = useSelector((state: WishlistState) => state) || { wishlist: [], loading: false, addingToWishlist: false, removingFromWishlist: false, error: null };

  useEffect(() => {
    // Fetch wishlist on mount if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  const handleFetchWishlist = () => {
    dispatch(fetchWishlist());
  };

  const handleAddToWishlist = (productId: number) => {
    dispatch(addToWishlist(productId));
  };

  const handleRemoveFromWishlist = (productId: number) => {
    dispatch(removeFromWishlist(productId));
  };

  return (
    <ReduxWishlistContext.Provider value={{
      wishlist,
      loading,
      addingToWishlist,
      removingFromWishlist,
      error,
      fetchWishlist: handleFetchWishlist,
      addToWishlist: handleAddToWishlist,
      removeFromWishlist: handleRemoveFromWishlist
    }}>
      {children}
    </ReduxWishlistContext.Provider>
  );
};

export const useReduxWishlist = () => {
  const context = useContext(ReduxWishlistContext);
  if (!context) {
    throw new Error('useReduxWishlist must be used within ReduxWishlistProvider');
  }
  return context;
};

// Wishlist context is now exported from the provider, store export removed

