import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { setToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in local storage on initial load
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
            setToken(token);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password,
            });
            const { token, ...userData } = response.data;
            setToken(token);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return response.data;
        } catch (error) {
            console.error('Login failed', error.response.data);
            throw error.response.data;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
    };

    const authContextValue = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
