import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [baselines, setBaselines] = useState({
        energy: 88,
        stability: 'Optimal',
        resonance: 43,
        journals: 12,
        calibrationComplete: false
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedBaselines = localStorage.getItem('baselines');
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedBaselines) setBaselines(JSON.parse(storedBaselines));
        setLoading(false);
    }, []);

    const updateBaselines = (newData) => {
        const updated = { ...baselines, ...newData };
        setBaselines(updated);
        localStorage.setItem('baselines', JSON.stringify(updated));
    };

    const login = async (email, password) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
        const userData = response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const register = async (name, email, password, role) => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { name, email, password, role });
        const userData = response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('baselines');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, baselines, updateBaselines }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
