// Auth Service - Simple authentication management
import api from "./api";

// Notify all components that auth state changed
const notifyAuthChange = () => {
    window.dispatchEvent(new Event("authChange"));
};

// Get current user from localStorage
export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
};

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem("token");
};

// Login function
export const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Notify components that user logged in
    notifyAuthChange();

    return user;
};

// Register function
export const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    const { token, user } = response.data;

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Notify components that user registered
    notifyAuthChange();

    return user;
};

// Logout function
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Notify components that user logged out
    notifyAuthChange();
};

// Check if user is logged in
export const isLoggedIn = () => {
    return !!getToken();
};

// Check if user is admin
export const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role === "admin";
};
