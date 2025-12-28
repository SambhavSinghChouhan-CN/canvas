import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<UserType>;
  signIn: (email: string, password: string) => Promise<UserType>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (name: string, email: string, password: string) => {
  setLoading(true);
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Registration failed');
    }

    const data = await response.json();

    const userObj = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: 'USER',
    };

    setUser(userObj);
    return userObj;
  } finally {
    setLoading(false);
  }
};


  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    // optionally remove JWT/localStorage here if you store it
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
