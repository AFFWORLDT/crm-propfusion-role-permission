import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
    InputAdornment,
    IconButton,
    Stack,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";
import toast from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.phone
        ) {
            toast.error("Please fill in all fields");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                name: formData.name.trim().replace(/\s+/g, "-"),
                email: formData.email.toLowerCase(),
                password: formData.password,
                phone: formData.phone,
            };
            const response = await fetch(
                "https://creator.propfusion.io/propfusion_manager/",
                {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            localStorage.setItem("registeredEmail", formData.email);
            sessionStorage.setItem("tempRegisterPass", formData.password);

            if (response.ok) {
                toast.success(
                    "Registration successful! Please check your email for verification."
                );
                setTimeout(() => {
                    navigate("/login");
                }, 1500); 
            } else {
                const errorData = await response.json();
                toast.error(
                    errorData.message ||
                        "Registration failed. Please try again."
                );
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(
                "Network error. Please check your connection and try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // PropFusion Logo JSX
    const PFLogo = (
        <Box
            sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 24px 0 rgba(37,99,235,0.10)",
                mb: 3,
                mx: "auto",
                p: 1.5,
            }}
        >
            <img
                src="/logo.png"
                alt="PropFusion Logo"
                style={{
                    width: "90%",
                    height: "90%",
                    objectFit: "contain",
                    display: "block",
                }}
            />
        </Box>
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                bgcolor: "#fafbfc",
                overflow: "hidden",
            }}
        >
            {/* Left Side - Register Form */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    height: "100vh",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 2, md: 0 },
                }}
            >
                <Box
                    width="100%"
                    maxWidth={420}
                    mx="auto"
                    px={{ xs: 1, sm: 3 }}
                >
                    <Box textAlign="center" mb={3}>
                        {PFLogo}
                        <Typography
                            variant="h3"
                            fontWeight={900}
                            mb={1}
                            fontSize={{ xs: 32, md: 40 }}
                            sx={{ color: "#1e293b", letterSpacing: 0.5 }}
                        >
                            Create Account
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="#334155"
                            mb={2}
                            fontSize={{ xs: 17, md: 20 }}
                            sx={{ fontWeight: 500 }}
                        >
                            Join PropFusion and start managing your properties
                            efficiently
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            label="Full Name"
                            type="text"
                            fullWidth
                            required
                            sx={{
                                mb: 2,
                                "& .MuiInputLabel-root": {
                                    fontWeight: 500,
                                    fontSize: 16,
                                },
                            }}
                        />

                        <TextField
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            label="Email Address"
                            type="email"
                            fullWidth
                            required
                            sx={{
                                mb: 2,
                                "& .MuiInputLabel-root": {
                                    fontWeight: 500,
                                    fontSize: 16,
                                },
                            }}
                        />

                        <TextField
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            label="Phone Number"
                            type="tel"
                            fullWidth
                            required
                            placeholder="+971542997582"
                            sx={{
                                mb: 2,
                                "& .MuiInputLabel-root": {
                                    fontWeight: 500,
                                    fontSize: 16,
                                },
                            }}
                        />

                        <TextField
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            fullWidth
                            required
                            sx={{
                                mb: 3,
                                "& .MuiInputLabel-root": {
                                    fontWeight: 500,
                                    fontSize: 16,
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword((s) => !s)
                                            }
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isLoading}
                            sx={{
                                py: 1.5,
                                fontWeight: 700,
                                fontSize: 18,
                                borderRadius: 999,
                                bgcolor: "#667eea",
                                "&:hover": { bgcolor: "#5a6fd8" },
                                boxShadow: "none",
                                mb: 2,
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress
                                    size={24}
                                    sx={{ color: "white" }}
                                />
                            ) : (
                                "Create Account"
                            )}
                        </Button>

                        <Typography
                            align="center"
                            color="#64748b"
                            fontSize={15}
                            sx={{ fontWeight: 500 }}
                        >
                            Already have an account?{" "}
                            <Link href="/login" underline="hover">
                                Sign in
                            </Link>
                        </Typography>

                        <Typography
                            align="center"
                            color="#64748b"
                            fontSize={15}
                            mt={3}
                            sx={{ fontWeight: 500 }}
                        >
                            By creating an account, you agree to our{" "}
                            <Link
                                href="https://www.propfusion.io/terms"
                                underline="hover"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="https://www.propfusion.io/privacy"
                                underline="hover"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Privacy Policy
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Right Side - Features */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    height: "100vh",
                    background:
                        "linear-gradient(135deg, #2563eb 0%, #9333ea 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 2, md: 0 },
                }}
            >
                <Box
                    width="100%"
                    maxWidth={520}
                    mx="auto"
                    px={{ xs: 1, sm: 3 }}
                    textAlign="left"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    justifyContent="center"
                    minHeight="100vh"
                >
                    {PFLogo}
                    <Typography
                        variant="h2"
                        fontWeight={900}
                        mb={1}
                        mt={2}
                        fontSize={{ xs: 32, md: 44 }}
                        sx={{ color: "#fff", letterSpacing: 0.5 }}
                    >
                        PropFusion CRM
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="#e0e7ff"
                        mb={4}
                        fontSize={{ xs: 18, md: 22 }}
                        sx={{ fontWeight: 500 }}
                    >
                        The AI-powered real estate platform that transforms how
                        you manage properties, clients, and deals.
                    </Typography>
                    <Stack
                        spacing={5}
                        alignItems="flex-start"
                        mt={6}
                        width="100%"
                    >
                        <Box display="flex" alignItems="flex-start" gap={2}>
                            <CheckCircle
                                sx={{ color: "#a5b4fc", mt: 0.5, fontSize: 32 }}
                            />
                            <Box textAlign="left">
                                <Typography
                                    fontWeight={800}
                                    fontSize={22}
                                    mb={0.5}
                                    sx={{ color: "#fff" }}
                                >
                                    Smart Property Management
                                </Typography>
                                <Typography
                                    color="#e0e7ff"
                                    fontSize={17}
                                    sx={{ fontWeight: 400 }}
                                >
                                    Manage your entire property portfolio with
                                    AI-powered insights and automation.
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="flex-start" gap={2}>
                            <CheckCircle
                                sx={{ color: "#a5b4fc", mt: 0.5, fontSize: 32 }}
                            />
                            <Box textAlign="left">
                                <Typography
                                    fontWeight={800}
                                    fontSize={22}
                                    mb={0.5}
                                    sx={{ color: "#fff" }}
                                >
                                    Client Relationship Tools
                                </Typography>
                                <Typography
                                    color="#e0e7ff"
                                    fontSize={17}
                                    sx={{ fontWeight: 400 }}
                                >
                                    Build stronger relationships with advanced
                                    CRM features and communication tools.
                                </Typography>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="flex-start" gap={2}>
                            <CheckCircle
                                sx={{ color: "#a5b4fc", mt: 0.5, fontSize: 32 }}
                            />
                            <Box textAlign="left">
                                <Typography
                                    fontWeight={800}
                                    fontSize={22}
                                    mb={0.5}
                                    sx={{ color: "#fff" }}
                                >
                                    Deal Pipeline Analytics
                                </Typography>
                                <Typography
                                    color="#e0e7ff"
                                    fontSize={17}
                                    sx={{ fontWeight: 400 }}
                                >
                                    Track deals from lead to close with powerful
                                    analytics and forecasting.
                                </Typography>
                            </Box>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default Register;
