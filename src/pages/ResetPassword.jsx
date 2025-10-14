import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, TextField, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Security, ArrowBack } from '@mui/icons-material';
import { verifyPasswordReset, resendPasswordResetOtp } from '../services/apiAuth';
import toast from 'react-hot-toast';
import { getPublicCompanyData } from '../services/apiCompany';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [companyData, setCompanyData] = useState({
        company_name: "PropFusion CRM",
        company_logo_url: "/logo.png"
    });

    const navigate = useNavigate();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const emailFromStorage = localStorage.getItem('resetEmail');
        
        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
            localStorage.setItem('resetEmail', decodeURIComponent(emailParam));
        } else if (emailFromStorage) {
            setEmail(emailFromStorage);
        } else {
            // Redirect to forget password if no email provided
            navigate('/password-reset/request');
        }
    }, [searchParams, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!otp || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits");
            return;
        }

        try {
            setIsLoading(true);
            await verifyPasswordReset({
                email,
                otp,
                new_password: newPassword
            });
            setIsSuccess(true);
            localStorage.removeItem('resetEmail');
            toast.success("Password reset successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setIsResending(true);
            await resendPasswordResetOtp(email);
            toast.success("OTP resent successfully!");
        } catch (error) {
            toast.error(error.message || "Failed to resend OTP");
        } finally {
            setIsResending(false);
        }
    };

    const handleBackToLogin = () => {
        localStorage.removeItem('resetEmail');
        navigate("/login");
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
                                Password Reset Successful!
                            </Typography>
                            <Typography variant="body1" color="#64748b" mb={3}>
                                Your password has been successfully reset. You can now log in with your new password.
                            </Typography>
                            
                            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                                Your account is now secure with your new password.
                            </Alert>

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleBackToLogin}
                                sx={{
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    borderRadius: 2,
                                    bgcolor: '#2563eb',
                                    '&:hover': { bgcolor: '#1d4ed8' }
                                }}
                            >
                                Continue to Login
                            </Button>
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
                            Reset Your Password
                        </Typography>
                        <Typography variant="body1" color="#64748b" mb={4}>
                            Enter the OTP sent to <strong>{email}</strong> and create a new password.
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <TextField
                                value={otp}
                                onChange={(e) => {
                                    // Only allow numbers and limit to 6 digits
                                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                    setOtp(value);
                                }}
                                label="Enter 6-digit OTP"
                                type="text"
                                fullWidth
                                required
                                placeholder="123456"
                                inputProps={{ 
                                    maxLength: 6,
                                    style: { 
                                        textAlign: 'center', 
                                        fontSize: '18px', 
                                        letterSpacing: '0.3em',
                                        fontFamily: 'monospace'
                                    } 
                                }}
                                InputProps={{
                                    startAdornment: <Security sx={{ mr: 1, color: '#9ca3af' }} />
                                }}
                                sx={{ 
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />

                            <TextField
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                required
                                sx={{ 
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                label="Confirm New Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                fullWidth
                                required
                                sx={{ 
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isLoading || !otp || !newPassword || !confirmPassword || otp.length !== 6}
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
                                        Resetting Password...
                                    </Box>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={handleResendOtp}
                                    disabled={isResending}
                                    sx={{
                                        py: 1,
                                        fontWeight: 500,
                                        fontSize: 14,
                                        borderRadius: 2,
                                        borderColor: '#d1d5db',
                                        color: '#6b7280',
                                        '&:hover': { 
                                            borderColor: '#9ca3af',
                                            bgcolor: '#f9fafb'
                                        }
                                    }}
                                >
                                    {isResending ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CircularProgress size={16} color="inherit" />
                                            Resending...
                                        </Box>
                                    ) : (
                                        "Didn't receive OTP? Resend"
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
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default ResetPassword;
