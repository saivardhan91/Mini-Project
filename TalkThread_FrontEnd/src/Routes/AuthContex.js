import { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Create AuthProvider
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [role, setRole] = useState(localStorage.getItem("role") || "");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});


    const signup = async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/sign/signup", data, { withCredentials: true });
            if (response.status === 200) {
                const { user, token } = response.data;
                setUser(user);
                setToken(token);
                setRole(user.role);
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("role", user.role);
                return response.data; // Return data on success
            }
        } catch (err) {
            console.error("Error signing up:", err.response?.data?.message || err.message);
            throw err.response?.data?.message || "Signup failed"; // Propagate the error
        }
    };
    
    const login = async (data) => {
        try {
            const response = await axios.post("http://localhost:5000/sign/signin", data, { withCredentials: true });
            if (response.status === 200) {
                const { user, token } = response.data;
                setUser(user);
                setToken(token);
                setRole(user.role);
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("role", user.role);
                return response.data; // Return data on success
            }
        } catch (err) {
            console.error("Error logging in:", err.response?.data?.message || err.message);
            throw err.response?.data?.message || "Login failed"; // Propagate the error
        }
    };
    
    const logout = async () => {
        try {
            await axios.post("http://localhost:5000/sign/logout"); // Add server-side logout if necessary
        } catch (err) {
            console.log("Error logging out:", err);
        }
        setRole("");
        setUser({});
        setToken("");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
    };

    return (
        <AuthContext.Provider value={{ token, user, role, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
