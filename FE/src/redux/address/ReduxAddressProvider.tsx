import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from './action';

export interface Address {
  id: number;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

interface AddressContextType {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  fetchAddresses: () => void;
  addAddress: (addressData: Omit<Address, 'id'>) => void;
  updateAddress: (id: number, addressData: Omit<Address, 'id'>) => void;
  deleteAddress: (id: number) => void;
}

const ReduxAddressContext = createContext<AddressContextType | undefined>(undefined);

export const ReduxAddressProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state: { address?: AddressState }) => state.address || { addresses: [], loading: false, error: null });

  useEffect(() => {
    // Fetch addresses on mount if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchAddresses());
    }
  }, [dispatch]);

  const handleFetchAddresses = () => {
    dispatch(fetchAddresses());
  };

  const handleAddAddress = (addressData: Omit<Address, 'id'>) => {
    dispatch(addAddress(addressData));
  };

  const handleUpdateAddress = (id: number, addressData: Omit<Address, 'id'>) => {
    dispatch(updateAddress(id, addressData));
  };

  const handleDeleteAddress = (id: number) => {
    dispatch(deleteAddress(id));
  };

  return (
    <ReduxAddressContext.Provider value={{
      addresses,
      loading,
      error,
      fetchAddresses: handleFetchAddresses,
      addAddress: handleAddAddress,
      updateAddress: handleUpdateAddress,
      deleteAddress: handleDeleteAddress
    }}>
      {children}
    </ReduxAddressContext.Provider>
  );
};

export const useReduxAddress = () => {
  const context = useContext(ReduxAddressContext);
  if (!context) {
    throw new Error('useReduxAddress must be used within ReduxAddressProvider');
  }
  return context;
};

// Address context is now exported from the provider, store export removed

