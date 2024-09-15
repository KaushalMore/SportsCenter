import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, CssBaseline, Box, Avatar, Typography, TextField, Button, Grid, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const validatePassword = (password) => {
        const errors = {};
        if (!/[A-Z]/.test(password)) {
            errors.uppercase = "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            errors.lowercase = "Password must contain at least one lowercase letter.";
        }
        if (!/[0-9]/.test(password)) {
            errors.number = "Password must contain at least one number.";
        }
        if (!/[!@#$%^&*]/.test(password)) {
            errors.specialChar = "Password must contain at least one special character.";
        }
        if (password.length < 6) {
            errors.length = "Password must be at least 6 characters long.";
        }
        return errors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const passwordErrors = validatePassword(formData.password);
        if (Object.keys(passwordErrors).length > 0) {
            setErrors(passwordErrors);
            return;
        }
        setErrors({});
        try {
            const response = await axios.post(`http://localhost:8081/api/auth/register`, formData);
            if (response.data.statusCode === 200) {
                navigate("/login");
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message); // Error message from the backend
            } else {
                setMessage('An unexpected error occurred');
            }
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.length || !!errors.uppercase || !!errors.lowercase || !!errors.number || !!errors.specialChar}
                        helperText={errors.length || errors.uppercase || errors.lowercase || errors.number || errors.specialChar}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    {message && <Typography color="error">{message}</Typography>}
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}
