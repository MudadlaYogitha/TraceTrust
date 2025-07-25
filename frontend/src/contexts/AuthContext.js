import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setIsLoggedIn(true);
            toast.success(`Welcome back, ${data.email}!`);
          } else {
            localStorage.removeItem('token');
            setUser(null);
            setIsLoggedIn(false);
            toast.error('Session expired. Please log in again.');
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          localStorage.removeItem('token');
          setUser(null);
          setIsLoggedIn(false);
          toast.error('Could not verify session. Please log in.');
        } finally {
          setLoadingAuth(false);
        }
      } else {
        setLoadingAuth(false);
      }
    };

    loadUser();
  }, [API_BASE_URL]);

  const login = async (email, password, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      toast.success('Logged in successfully!');
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed.');
      throw error;
    }
  };

  const register = async (email, password, role = 'consumer') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser({ _id: data._id, email: data.email, role: data.role });
      setIsLoggedIn(true);
      toast.success('Registered and logged in successfully!');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    toast.info('You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loadingAuth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};