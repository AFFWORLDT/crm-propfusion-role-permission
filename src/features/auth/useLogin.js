import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function useLogin() {
    const { login } = useAuth(); 
    
    const { mutate: handleLogin, isPending } = useMutation({
        mutationFn: (credentials) => loginApi(credentials),
        onSuccess: (data) => login(data),
        onError: (err) => toast.error(err.message),
    });

    return { handleLogin, isPending };
}

export default useLogin;
