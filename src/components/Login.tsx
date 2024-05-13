import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store";

interface FormData {
    email: string;
    password: string;
}

const Login = () => {
    const navigate = useNavigate();
    const { setToken } = useStore();
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        errors: {
            email: '',
            password: '',
        }
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword)
    const handleMouseDownPassword = () => setShowPassword(!showPassword)

    const validate = () => {
        let isValid = true;
        const errors: FormData = {  
                                    email: '',
                                    password: '',
                                 }

        if (!formData.email) {
            errors.email = 'Enter an email';
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Enter a password';
            isValid = false;
        }

        setFormData(form => ({ ...form, errors }));
        return isValid
    }

    const loginUser = async () => {
        try {
            const response = await axios.post(`http://localhost:4941/api/v1/users/login`, {
                email: formData.email,
                password: formData.password
            });
            return response.data.token;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 401) {
                    throw new Error('Invalid email or password') 
                } else {
                    throw new Error('Login failed')
                }
            }
        }
    }
    
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
    
        if (validate()) {
            try {
                const token = await loginUser();
                console.log(token)
                setToken(token);
                navigate('/', {state: {login: true} })

            } catch (error: any) {  
                if (error instanceof Error) { 
                    setFormData((form) => ({
                        ...form,
                        errors: { ...form.errors, email: error.message }
                    }));
                } else {
                    setFormData((form) => ({
                        ...form,
                        errors: { ...form.errors, email: "An unknown error occurred" }
                    }));
                }
            }
        }
    };
    
    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setFormData(form => ({ ...form, [name]: value }));
    };

    return (
        <Box 
            component="form"
            onSubmit={handleSubmit}
            sx={{
                '& .MuiTextField-root': { m: 2, width: '28ch'}
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <div>
                    <h1>Login</h1>
                </div>
                <div>
                    <TextField
                        required
                        name="email"
                        id="outlined-required"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!formData.errors.email}
                        helperText={formData.errors.email}
                    />
                </div>
                <div>
                    <TextField
                        required
                        name="password"
                        id="outlined-required"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!formData.errors.password}
                        helperText={formData.errors.password}
                        InputProps={{ 
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            )
                        }} 
                    />
                </div>
                <div >
                    <Button 
                        sx={{ m: 2}}
                        type="submit"
                        variant="contained"
                    >
                        Login
                    </Button>
                </div>
            </div>
            <div>
                <Link to="/register" style={{ textDecoration: 'none' }}>Don't have an account? Register here</Link>
            </div>
        </Box >
    )
}

export default Login;