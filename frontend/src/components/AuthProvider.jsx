import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase'; // Impor auth dari firebase.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '',
        });
        localStorage.setItem('user', JSON.stringify({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '',
        }));
        localStorage.setItem('authToken', firebaseUser.accessToken);
      } else {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      return {
        success: true,
        data: {
          user: {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName || '',
          },
          token: userCredential.user.accessToken,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const register = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      return {
        success: true,
        data: {
          user: {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userData.name || '',
          },
          token: userCredential.user.accessToken,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
