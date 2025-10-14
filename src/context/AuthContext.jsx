import { createContext, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();
const AuthContext = createContext();

function AuthProvider() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    function login(data) {
        const userData = typeof data === "string" ? JSON.parse(data) : data;
        cookies.set("USER", userData, {
            path: "/",
        });
        localStorage.setItem("CRMUSER", JSON.stringify(userData));
        setCurrentUser(userData);
        navigate("/", { replace: true });
    }

    function logout() {
        setCurrentUser(null);
        cookies.remove("USER", { path: "/" });
        localStorage.removeItem("CRMUSER");
        localStorage.removeItem(`app_features-${getApiUrl()}`);
        navigate("/login", { replace: true });
    }

    useEffect(() => {
        try {
            const cookieUser = cookies.get("USER");
            if (cookieUser) {
                setCurrentUser(cookieUser);
                setIsLoading(false);
                return;
            }

            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                const userData = JSON.parse(localUser);
                cookies.set("USER", userData, { path: "/" });
                setCurrentUser(userData);
                setIsLoading(false);
                return;
            }

            // No user found in either storage
            setIsLoading(false);
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Auth initialization error:", error);
            setIsLoading(false);
            logout();
        }
    }, [navigate]);

    if (isLoading) {
        return null; // or a loading spinner component
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
            <Outlet />
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
