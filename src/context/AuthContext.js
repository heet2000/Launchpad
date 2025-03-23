import React, { createContext, useState, useEffect, useContext } from 'react';

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
            const registeredUserData = localStorage.getItem('registeredUser');

            if (!registeredUserData) {
                throw new Error('No registered user found. Please register first.');
            }

            const registeredUser = JSON.parse(registeredUserData);

            // Validate credentials
            if (email !== registeredUser.email || password !== registeredUser.password) {
                throw new Error('Invalid email or password');
            }

            // If validation passes, set the user
            const user = {
                email: registeredUser.email,
                name: registeredUser.name,
                empId: registeredUser.empId
            };

            // Generate mock token
            const mockToken = `token_${Math.random().toString(36).substring(2, 15)}`;

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