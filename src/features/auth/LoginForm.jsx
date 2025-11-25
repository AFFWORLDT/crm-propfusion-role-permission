import { useState, useEffect } from "react";
// import styles from "../../styles/AuthForm.module.css";
import useLogin from "./useLogin";
import Loader from "../../ui/Loader";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';

function LoginForm() {
    const [organizationName, setOrganizationName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { handleLogin, isPending } = useLogin();

    useEffect(() => {
        const registeredEmail = localStorage.getItem('registeredEmail');
        const tempPassword = sessionStorage.getItem('tempRegisterPass');
        
        if (registeredEmail) {
            setEmail(registeredEmail);
            // Clean up the stored email
            localStorage.removeItem('registeredEmail');
        }
        
        if (tempPassword) {
            setPassword(tempPassword);
            // Clean up the stored password
            sessionStorage.removeItem('tempRegisterPass');
        }
    }, []);

    const shouldShowOrganizationField = () => {
        const hostname = window.location.hostname;
        return hostname === "crm.propfusion.io";
    };

    useEffect(() => {
        if (shouldShowOrganizationField()) {
            const orgName = localStorage.getItem("organizationName");
            if (orgName) setOrganizationName(orgName);
        }
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        if (!email || !password) return;
        if (shouldShowOrganizationField() && organizationName) {
            localStorage.setItem("organizationName", organizationName);
        }
        handleLogin({ username: email.toLowerCase(), password }, {
            onSuccess: () => {
                localStorage.removeItem('registeredEmail');
                sessionStorage.removeItem('tempRegisterPass');
            }
        });
    }

    return !isPending ? (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                mt: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                bgcolor: '#fff',
            }}
        >
            <Typography variant="h4" fontWeight={600} mb={1} align="center" sx={{ width: '100%' }}>
                {/* Log in with your email */}
            </Typography>
            {shouldShowOrganizationField() && (
                <TextField
                    value={organizationName}
                    onChange={e => setOrganizationName(e.target.value)}
                    label="Organization Name"
                    type="text"
                    fullWidth
                    required
                    InputLabelProps={{ style: { fontWeight: 500, fontSize: 16 } }}
                    inputProps={{ 'aria-label': 'Organization Name', style: { fontSize: 16 } }}
                    variant="outlined"
                    sx={{ bgcolor: '#fff' }}
                />
            )}
            <TextField
                value={email}
                onChange={e => setEmail(e.target.value)}
                label="Email"
                type="email"
                fullWidth
                required
                InputLabelProps={{ style: { fontWeight: 500, fontSize: 16 } }}
                inputProps={{ 'aria-label': 'Email', style: { fontSize: 16 } }}
                variant="outlined"
                sx={{ bgcolor: '#fff' }}
            />
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                <Typography fontWeight={500} fontSize={16} color="#222">
                    Password
                </Typography>
                <Link to="/password-reset/request" style={{ color: '#757575', textDecoration: 'none', fontSize: 14 }}>
                    Forgot your password?
                </Link>
            </Box>
            <TextField
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                variant="outlined"
                inputProps={{ 'aria-label': 'Password', style: { fontSize: 16 } }}
                sx={{ bgcolor: '#fff', mb: 1 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(s => !s)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isPending}
                sx={{
                    mt: 1,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: 18,
                    borderRadius: 999,
                    bgcolor: '#111',
                    '&:hover': { bgcolor: '#222' },
                    boxShadow: 'none',
                }}
            >
                Login
            </Button>
            <Typography mt={2} color="#757575" fontSize={15} align="center" width="100%">
                Don&apos;t have an account?{' '}
                <a href="https://partnership.onexproperty.com/apply" target="_blank" rel="noopener noreferrer" style={{ color: '#111', textDecoration: 'none', fontWeight: 600 }}>
                    Sign up
                </a>
            </Typography>
        </Box>
    ) : (
        <Loader />
    );
}

export default LoginForm;
