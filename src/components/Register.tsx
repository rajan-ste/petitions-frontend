import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles'
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    filetype: string;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });  

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        filetype: '',
        errors: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            filetype: '',
        }
    });
    const [file, setFile] = React.useState<File | null>(null);
    const [error, setError] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword)
    const handleMouseDownPassword = () => setShowPassword(!showPassword)
    const [userId, setUserId] = React.useState(0);
    const validFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

    const validate = () => {
        let isValid = true;
        const errors: FormData = {  
                                    firstName: '',
                                    lastName: '',
                                    email: '',
                                    password: '',
                                    filetype: '',
                                 }

        if (!formData.firstName) {
            errors.firstName = 'Enter a first name';
            isValid = false;
        }

        if (!formData.lastName) {
            errors.lastName = 'Enter a last name';
            isValid = false;
        }

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Enter a valid email';
            isValid = false;
        }

        if (!formData.password || formData.password.length < 6) {
            errors.password = 'Password too short';
            isValid = false;
        }

        if (file) {
            if (!validFileTypes.includes(file.type)) {
                errors.filetype = 'Upload PNG, JPG or GIF file';
                isValid = false;
            }
        }

        setFormData(form => ({ ...form, errors }));
        return isValid
    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (validate()) {
            axios.post('http://localhost:4941/api/v1/users/register', {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password
            })
            .then((response) => {
                const id = response.data.userId;
                setUserId(id)
                if (file) {
                    handleUpload(id)
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    setFormData(form => ({
                        ...form,
                        errors: { ...form.errors, email: 'Email already in use' }
                    }));
                }
            });
        }
    };

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setFormData(form => ({ ...form, [name]: value }));
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setError("");
        } else {
            setFile(null); 
            setError("No file selected.");
        }
    };

      const handleUpload = (userId: number) => {
        if (file) {
          axios
            .put(
              `http://localhost:4941/api/v1/users/${userId}/image`,
              file,
              {
                headers: {
                  "Content-Type": file.type,
                },
              }
            )
            .then((response) => {
              
            })
            .catch((error) => {
              if (error.response && error.response.status === 400) {
                setError("Invalid file type. Please try again.");
              } else {
                setError("Error occured uploading profile image")
              }
            });
        }
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
                    <h1>Register</h1>
                </div>
                <div>
                    <TextField
                            required
                            name="firstName"
                            id="outlined-required"
                            label="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={!!formData.errors.firstName}
                            helperText={formData.errors.firstName}
                        />
                </div>
                <div>
                    <TextField
                        required
                        name="lastName"
                        id="outlined-required"
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!formData.errors.lastName}
                        helperText={formData.errors.lastName}
                    />
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
                <div style={{ margin: 10 }}>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        >
                        Upload Profile Photo
                        <VisuallyHiddenInput type="file" onChange={handleFileChange}/>
                    </Button>
                    {file ? <p>{file.name}</p> : ""}
                    {formData.errors.filetype && <div style={{ color: "red", marginTop: "10px" }}>{formData.errors.filetype}</div>}
                </div>
                <div >
                    <Button 
                        sx={{ m: 2}}
                        type="submit"
                        variant="contained"
                    >
                        Register
                    </Button>
                </div>
            </div>
        </Box >
    )
}

export default Register;