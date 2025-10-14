import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, TextField, Alert, CircularProgress } from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import { requestPasswordReset } from '../services/apiAuth';
import toast from 'react-hot-toast';
import { getPublicCompanyData } from '../services/apiCompany';

function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [companyData, setCompanyData] = useState({
        company_name: "PropFusion CRM",
        company_logo_url: "/logo.png"
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            setIsLoading(true);
            await requestPasswordReset(email);
            setIsSuccess(true);
            toast.success("Password reset OTP sent to your email!");
        } catch (error) {
            toast.error(error.message || "Failed to send reset request");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    const handleContinueToReset = () => {
        // Store email in localStorage for the reset page
        localStorage.setItem('resetEmail', email);
        navigate('/password-reset/verify');
    };

    // Company Logo JSX
    const CompanyLogo = (
        <Box sx={{
            width: 56,
            height: 56,
            borderRadius: '12px',
            bgcolor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            mx: 'auto',
            border: '1px solid #e2e8f0'
        }}>
            <img 
                src={companyData.company_logo_url} 
                alt={companyData.company_name}
                style={{ 
                    width: 32, 
                    height: 32, 
                    objectFit: 'contain' 
                }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                }}
            />
            <Box sx={{ 
                display: 'none', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#2563eb'
            }}>
                {companyData.company_name.charAt(0)}
            </Box>
        </Box>
    );

    if (isSuccess) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#fafbfc',
                p: 2
            }}>
                <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box textAlign="center">
                            {CompanyLogo}
                            <Typography variant="h4" fontWeight={700} mb={1} color="#1e293b">
                                Check Your Email
                            </Typography>
                            <Typography variant="body1" color="#64748b" mb={3}>
                                We've sent a password reset OTP to <strong>{email}</strong>
                            </Typography>
                            
                            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                                Please check your email and click the link to reset your password. The OTP will expire in 15 minutes.
                            </Alert>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleContinueToReset}
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        borderRadius: 2,
                                        bgcolor: '#2563eb',
                                        '&:hover': { bgcolor: '#1d4ed8' }
                                    }}
                                >
                                    Enter OTP to Reset Password
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={handleBackToLogin}
                                    startIcon={<ArrowBack />}
                                    sx={{
                                        py: 1.5,
                                        fontWeight: 600,
                                        fontSize: 16,
                                        borderRadius: 2,
                                        borderColor: '#d1d5db',
                                        color: '#374151',
                                        '&:hover': { 
                                            borderColor: '#9ca3af',
                                            bgcolor: '#f9fafb'
                                        }
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#fafbfc',
            p: 2
        }}>
            <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                    <Box textAlign="center">
                        {CompanyLogo}
                        <Typography variant="h4" fontWeight={700} mb={1} color="#1e293b">
                            Forgot Password?
                        </Typography>
                        <Typography variant="body1" color="#64748b" mb={4}>
                            No worries! Enter your email address and we'll send you an OTP to reset your password.
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <TextField
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email Address"
                                type="email"
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <Email sx={{ mr: 1, color: '#9ca3af' }} />
                                }}
                                sx={{ 
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isLoading || !email}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    borderRadius: 2,
                                    bgcolor: '#2563eb',
                                    '&:hover': { bgcolor: '#1d4ed8' },
                                    mb: 2
                                }}
                            >
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CircularProgress size={20} color="inherit" />
                                        Sending OTP...
                                    </Box>
                                ) : (
                                    'Send Reset OTP'
                                )}
                            </Button>

                            <Button
                                variant="text"
                                fullWidth
                                onClick={handleBackToLogin}
                                startIcon={<ArrowBack />}
                                sx={{
                                    color: '#6b7280',
                                    fontWeight: 500,
                                    '&:hover': { bgcolor: '#f3f4f6' }
                                }}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default ForgetPassword;
