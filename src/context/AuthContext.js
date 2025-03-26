import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
// Create Auth Context
const AuthContext = createContext();

// Token expiration time in milliseconds (30 minutes)
const TOKEN_EXPIRATION = 30 * 60 * 1000;

// Export Auth Context Provider
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    // Check if user is logged in when the component mounts
    useEffect(() => {
        const checkUserSession = () => {
            const userData = localStorage.getItem('user');
            const storedToken = localStorage.getItem('authToken');
            const tokenExpiration = localStorage.getItem('tokenExpiration');

            if (userData && storedToken && tokenExpiration) {
                // Check if token has expired
                if (new Date().getTime() < parseInt(tokenExpiration, 10)) {
                    setCurrentUser(JSON.parse(userData));
                    setToken(storedToken);
                } else {
                    // Token has expired, clear storage
                    logout();
                }
            }
            setLoading(false);
        };

        checkUserSession();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            // Get the registered user data from localStorage

            const response = await axios.post('https://f767-2401-4900-1cb2-8c47-8516-9f7e-5b84-e7e8.ngrok-free.app/login', { email, password }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'abcdef',
                }
            });

            if (response.status === 200 || response.status === 201) {
                // If validation passes, set the user
                const user = {
                    email,
                    empId: response?.data?.empId
                };

                // Generate mock token
                const mockToken = response.data?.token;

                // Set expiration time (current time + 30 minutes)
                const expirationTime = new Date().getTime() + TOKEN_EXPIRATION;

                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('authToken', mockToken);
                localStorage.setItem('tokenExpiration', expirationTime.toString());

                // Set in state
                setCurrentUser(user);
                setToken(mockToken);

                // Set up auto-logout when token expires
                setTimeout(() => {
                    logout();
                }, TOKEN_EXPIRATION);

                return user;
            }
        } catch (error) {
            throw error;
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('lastAttendanceDate');
        setCurrentUser(null);
        setToken(null);
    };

    // Check if token is valid
    const isAuthenticated = () => {
        const tokenExpiration = localStorage.getItem('tokenExpiration');
        return !!token && !!tokenExpiration && new Date().getTime() < parseInt(tokenExpiration, 10);
    };

    const value = {
        currentUser,
        login,
        logout,
        loading,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 