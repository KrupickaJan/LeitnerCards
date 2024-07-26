import React, { useContext, createContext, useState, useEffect } from "react";
import UserService from "../service/UserService";

export const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => { },
    isAdmin: false,
    setIsAdmin: () => { },
});

export const useIsAuthenticated = () => useContext(AuthContext);
export const useIsAdmin = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(UserService.isAuthenticated());
    const [isAdmin, setIsAdmin] = useState(UserService.isAdmin());


    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(UserService.isAuthenticated());
            setIsAdmin(UserService.isAdmin());
        };
        window.addEventListener('storage', handleStorageChange);
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };

    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, setIsAuthenticated, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;