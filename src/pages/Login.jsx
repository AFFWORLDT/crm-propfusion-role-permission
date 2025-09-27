// import styles from "./../styles/AuthPage.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Box, Card, CardContent, Typography, Button, Divider, TextField, Checkbox, FormControlLabel, Link, InputAdornment, IconButton, Stack } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, CheckCircle } from '@mui/icons-material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import LoginForm from '../features/auth/LoginForm';
import { getPublicCompanyData } from '../services/apiCompany';

function Login() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({
    company_name: "PropFusion CRM",
    company_logo_url: "/logo.png"
  });
  const [isLoadingCompanyData, setIsLoadingCompanyData] = useState(true);

  useEffect(() => {
    if (currentUser) return navigate("/");
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await getPublicCompanyData();
        setCompanyData(data);
      } catch (error) {
        console.error("Failed to fetch company data:", error);
        // Keep default values if API fails
      } finally {
        setIsLoadingCompanyData(false);
      }
    };

    fetchCompanyData();
  }, []);

  // Dynamic Company Logo JSX
  const CompanyLogo = (
    <Box sx={{
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 24px 0 rgba(37,99,235,0.10)',
      mb: 3,
      mx: 'auto',
      p: 1.5
    }}>
      <img 
        src={companyData.company_logo_url} 
        alt={`${companyData.company_name} Logo`} 
        style={{ width: '90%', height: '90%', objectFit: 'contain', display: 'block' }} 
        onError={(e) => {
          e.target.src = "/logo.png"; // Fallback to default logo
        }}
      />
    </Box>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      bgcolor: '#fafbfc',
      overflow: 'hidden',
    }}>
      {/* Left Side - Login */}
      <Box sx={{
        flex: 1,
        minWidth: 0,
        height: '100vh',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 0 },
      }}>
        <Box width="100%" maxWidth={420} mx="auto" px={{ xs: 1, sm: 3 }}>
          <Box textAlign="center" mb={3}>
            {CompanyLogo}
            <Typography variant="h3" fontWeight={900} mb={0.5} fontSize={{ xs: 32, md: 40 }} sx={{ color: '#1e293b', letterSpacing: 0.5 }}>Welcome back</Typography>
            <Typography variant="subtitle1" color="#334155" mb={2} fontSize={{ xs: 17, md: 20 }} sx={{ fontWeight: 500 }}>
              {isLoadingCompanyData ? "Loading..." : `Sign in to ${companyData.company_name}`}
            </Typography>
          </Box>
          <LoginForm />
          <Typography align="center" color="#64748b" fontSize={15} mt={3} sx={{ fontWeight: 500 }}>
            By signing in, you agree to our <Link href="https://www.propfusion.io/terms" underline="hover" target="_blank" rel="noopener noreferrer">Terms of Service</Link> and <Link href="https://www.propfusion.io/privacy" underline="hover" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
          </Typography>
        </Box>
      </Box>
      {/* Right Side - Features */}
      <Box sx={{
        flex: 1,
        minWidth: 0,
        height: '100vh',
        background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 0 },
      }}>
        <Box width="100%" maxWidth={520} mx="auto" px={{ xs: 1, sm: 3 }} textAlign="left" display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" minHeight="100vh">
          {CompanyLogo}
          <Typography variant="h2" fontWeight={900} mb={1} mt={2} fontSize={{ xs: 32, md: 44 }} sx={{ color: '#fff', letterSpacing: 0.5 }}>
            {isLoadingCompanyData ? "Loading..." : companyData.company_name}
          </Typography>
          <Typography variant="subtitle1" color="#e0e7ff" mb={4} fontSize={{ xs: 18, md: 22 }} sx={{ fontWeight: 500 }}>
            The AI-powered real estate platform that transforms how you manage properties, clients, and deals.
          </Typography>
          <Stack spacing={5} alignItems="flex-start" mt={6} width="100%">
            <Box display="flex" alignItems="flex-start" gap={2}>
              <CheckCircle sx={{ color: '#a5b4fc', mt: 0.5, fontSize: 32 }} />
              <Box textAlign="left">
                <Typography fontWeight={800} fontSize={22} mb={0.5} sx={{ color: '#fff' }}>Smart Property Management</Typography>
                <Typography color="#e0e7ff" fontSize={17} sx={{ fontWeight: 400 }}>
                  Manage your entire property portfolio with AI-powered insights and automation.
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="flex-start" gap={2}>
              <CheckCircle sx={{ color: '#a5b4fc', mt: 0.5, fontSize: 32 }} />
              <Box textAlign="left">
                <Typography fontWeight={800} fontSize={22} mb={0.5} sx={{ color: '#fff' }}>Client Relationship Tools</Typography>
                <Typography color="#e0e7ff" fontSize={17} sx={{ fontWeight: 400 }}>
                  Build stronger relationships with advanced CRM features and communication tools.
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="flex-start" gap={2}>
              <CheckCircle sx={{ color: '#a5b4fc', mt: 0.5, fontSize: 32 }} />
              <Box textAlign="left">
                <Typography fontWeight={800} fontSize={22} mb={0.5} sx={{ color: '#fff' }}>Deal Pipeline Analytics</Typography>
                <Typography color="#e0e7ff" fontSize={17} sx={{ fontWeight: 400 }}>
                  Track deals from lead to close with powerful analytics and forecasting.
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
