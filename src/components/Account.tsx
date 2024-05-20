import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, TextField, Typography } from "@mui/material";
import useStore from "../store";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import axios from "axios";
import PetitionListObject from "./common/PetitionListObject";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

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

interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
}

interface PasswordFormData {
    currentPassword: string;
    password: string;
}

const Account = () => {
    const { delToken, token, userId } = useStore();
    const [user, setUser] = React.useState<User>({ firstName: '', lastName: '', email: '' });
    const [myPetitions, setMyPetitions] = React.useState<Array<PetitionList>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openUserEditDialog, setOpenUserEditDialog] = React.useState(false);
    const [openPasswordEditDialog, setOpenPasswordEditDialog] = React.useState(false);
    const [openImageEditDialog, setOpenImageEditDialog] = React.useState(false);
    const [userFormValues, setUserFormValues] = React.useState<UserFormData>({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [passwordFormValues, setPasswordFormValues] = React.useState<PasswordFormData>({
        currentPassword: '',
        password: ''
    });
    const [file, setFile] = React.useState<File | null>(null);
    const defaultPetition: PetitionList = {
        petitionId: 0,
        title: "",
        categoryId: 0,
        creationDate: "",
        ownerId: 0,
        ownerFirstName: "",
        ownerLastName: "",
        numberOfSupporters: 0,
        supportingCost: 0,
        category: ""
    };
    const [dialogMyPet, setDialogMyPet] = React.useState<PetitionList>(defaultPetition);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);

    const handleOpenUserEditDialog = (userData: UserFormData) => {
        setUserFormValues({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
        });
        setOpenUserEditDialog(true);
    };

    const handleCloseUserEditDialog = () => {
        setOpenUserEditDialog(false);
        setErrorFlag(false);
        setErrorMessage('');
    };

    const handleOpenPasswordEditDialog = () => {
        setOpenPasswordEditDialog(true);
    };

    const handleClosePasswordEditDialog = () => {
        setOpenPasswordEditDialog(false);
        setErrorFlag(false);
        setErrorMessage('');
    };

    const handleOpenImageEditDialog = () => {
        setOpenImageEditDialog(true);
    };

    const handleCloseImageEditDialog = () => {
        setOpenImageEditDialog(false);
        setFile(null);
        setErrorFlag(false);
        setErrorMessage('');
    };

    const handleUserEditInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setUserFormValues({
            ...userFormValues,
            [name]: value
        });
    };

    const handlePasswordEditInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setPasswordFormValues({
            ...passwordFormValues,
            [name]: value
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUserEditSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        
        axios.patch(`http://localhost:4941/api/v1/users/${userId}`, userFormValues, {
            headers: {
                'X-Authorization': token
            }
        })
        .then((response) => {
            window.location.reload();
        })
        .catch((error) => {
            setErrorFlag(true);
            setErrorMessage(error.response.statusText);
        })
    };

    const handlePasswordEditSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        
        axios.patch(`http://localhost:4941/api/v1/users/${userId}`, passwordFormValues, {
            headers: {
                'X-Authorization': token
            }
        })
        .then((response) => {
            window.location.reload();
        })
        .catch((error) => {
            setErrorFlag(true);
            setErrorMessage(error.response.statusText);
        })
    };

    const handleImageEditSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (!file) return;

        axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, file, {
            headers: {
                "Content-Type": file.type,
                "X-Authorization": token
            }
        })
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });
    };

    const handleDeleteImage = () => {
        axios.delete(`http://localhost:4941/api/v1/users/${userId}/image`, {
            headers: {
                'X-Authorization': token
            }
        })
        .then((response) => {
            window.location.reload();
        })
        .catch((error) => {
            setErrorFlag(true);
            setErrorMessage(error.response.statusText);
        })
    };

    const handleSnackBarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

    const handleOpenDeleteDialog = (petition: PetitionList) => {
        setDialogMyPet(petition);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const deletePetition = () => {
        axios.delete(`http://localhost:4941/api/v1/petitions/${dialogMyPet.petitionId}`, {
            headers: {
                "X-Authorization": token
            },
        })
            .then((response) => {
                const updatedPetitions = myPetitions.filter(p => p.petitionId !== dialogMyPet.petitionId);
                setMyPetitions(updatedPetitions);
                setOpenSnackBar(true);
                setOpenDeleteDialog(false);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            })
    };

    React.useEffect(() => {
        const getUser = () => {
            axios.get(`http://localhost:4941/api/v1/users/${userId}`, {
                headers: {
                    "X-Authorization": token
                },
            })
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage('');
                    setUser(response.data);
                    setUserFormValues({
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email,
                    })
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getUser();
    }, [userId, token]);

    React.useEffect(() => {
        const getMyPetitions = () => {
            axios.get(`http://localhost:4941/api/v1/petitions?ownerId=${userId}`)
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setMyPetitions(response.data.petitions);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getMyPetitions();
    }, [userId])

    React.useEffect(() => {
        const getCategories = () => {
            axios.get('http://localhost:4941/api/v1/petitions/categories')
                .then((response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setCategories(response.data);
                }, (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };
        getCategories();
    }, [setCategories]);

    myPetitions.forEach((petition) => {
        const category = categories.find(cat => cat.categoryId === petition.categoryId);
        const categoryName = category ? category.name : 'null';
        petition.category = categoryName;
    })

    const my_petition_rows = () => {
        return myPetitions.map((petition: PetitionList) => (
            <PetitionListObject
                key={petition.petitionId}
                petition={petition}
                delBool={petition.numberOfSupporters === 0}
                editBool={true}
                delToggle={() => handleOpenDeleteDialog(petition)}
            />
        ));
    }

    return (
        <>
            <h1>Account</h1>
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                <Avatar
                    alt={`${user.firstName} ${user.lastName}`}
                    src={`http://localhost:4941/api/v1/users/${userId}/image`}
                    sx={{ width: 80, height: 80, mb: 2 }}
                />
                <Typography variant="h6" component="div">
                    <strong>First Name: </strong><Typography component="span" variant="h6">{user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}</Typography>
                </Typography>
                <Typography variant="h6" component="div">
                    <strong>Last Name: </strong> <Typography component="span" variant="h6">{user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}</Typography>
                </Typography>
                <Typography variant="h6" component="div">
                    <strong>Email:</strong> <Typography component="span" variant="h6">{user.email}</Typography>
                </Typography>
                <Box display="flex" justifyContent="center" mt={3} mb={3}>
                    <Button onClick={() => handleOpenUserEditDialog(userFormValues)}
                        variant="contained"
                        color="primary"
                        sx={{ mr: 2 }}>Edit Details
                    </Button>
                    <Button onClick={handleOpenPasswordEditDialog}
                        variant="contained"
                        color="primary"
                        sx={{ mr: 2 }}>Edit Password
                    </Button>
                    <Button onClick={handleOpenImageEditDialog}
                        variant="contained"
                        color="primary">Edit Profile Image
                    </Button>
                </Box>
                <Button onClick={delToken} variant="contained" color="secondary">
                    Logout
                </Button>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6" component="div" sx={{ mr: 2, ml: 5 }}>
                    My Petitions
                </Typography>
                <Button component={RouterLink} to="/account/create" variant="contained" color="primary">
                    Create
                </Button>
            </Box>
            <Box sx={{ flexGrow: 1, ml: 5, mr: 5 }}>
                <Grid container spacing={2}>
                    {myPetitions.length > 0 ? my_petition_rows() : "You have no petitions"}
                </Grid>
            </Box>
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete Petition?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this petition?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button variant="outlined" color="error" onClick={deletePetition} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openUserEditDialog}
                onClose={handleCloseUserEditDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Edit User Details"}
                </DialogTitle>
                <DialogContent>
                    <Grid item sm={12} lg={4}>
                        <Box
                            component="form"
                            id="edit-user-form"
                            onSubmit={handleUserEditSubmit}
                            sx={{
                                '& .MuiTextField-root': {
                                    m: 1,
                                },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                name="firstName"
                                label="First Name"
                                value={userFormValues.firstName}
                                onChange={handleUserEditInputChange}
                                fullWidth
                            />
                            <TextField
                                name="lastName"
                                label="Last Name"
                                value={userFormValues.lastName}
                                onChange={handleUserEditInputChange}
                                fullWidth
                            />
                            <TextField
                                name="email"
                                label="Email"
                                value={userFormValues.email}
                                onChange={handleUserEditInputChange}
                                fullWidth
                            />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%', 
                                mt: 2,
                            }}>
                            </Box>
                            {errorFlag ? <Alert severity="error">{errorMessage}</Alert> : ""}
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUserEditDialog}>Cancel</Button>
                    <Button variant="outlined" color="primary" type="submit" form="edit-user-form">
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openPasswordEditDialog}
                onClose={handleClosePasswordEditDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Edit Password"}
                </DialogTitle>
                <DialogContent>
                    <Grid item sm={12} lg={4}>
                        <Box
                            component="form"
                            id="edit-password-form"
                            onSubmit={handlePasswordEditSubmit}
                            sx={{
                                '& .MuiTextField-root': {
                                    m: 1,
                                },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField
                                name="currentPassword"
                                label="Current Password"
                                type="password"
                                value={passwordFormValues.currentPassword}
                                onChange={handlePasswordEditInputChange}
                                fullWidth
                            />
                            <TextField
                                name="password"
                                label="New Password"
                                type="password"
                                value={passwordFormValues.password}
                                onChange={handlePasswordEditInputChange}
                                fullWidth
                            />
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%', 
                                mt: 2,
                            }}>
                            </Box>
                            {errorFlag ? <Alert severity="error">{errorMessage}</Alert> : ""}
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePasswordEditDialog}>Cancel</Button>
                    <Button variant="outlined" color="primary" type="submit" form="edit-password-form">
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openImageEditDialog}
                onClose={handleCloseImageEditDialog}
                aria-labelledby="edit-image-dialog-title"
                aria-describedby="edit-image-dialog-description"
            >
                <DialogTitle id="edit-image-dialog-title">
                    {"Edit Profile Image"}
                </DialogTitle>
                <DialogContent>
                    <Grid item sm={12} lg={4}>
                        <Box
                            component="form"
                            id="edit-image-form"
                            onSubmit={handleImageEditSubmit}
                            sx={{
                                '& .MuiTextField-root': {
                                    m: 1,
                                },
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}>
                                Upload Profile Photo
                                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                            </Button>
                            {file ? <p>{file.name}</p> : ""}
                            {errorFlag ? <Alert severity="error">{errorMessage}</Alert> : ""}
                        </Box>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImageEditDialog}>Cancel</Button>
                    <Button variant="outlined" color="primary" type="submit" form="edit-image-form">
                        Upload
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleDeleteImage}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackBar}
                autoHideDuration={5000}
                onClose={handleSnackBarClose}
            >
                <Alert
                    onClose={handleSnackBarClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Petition successfully deleted
                </Alert>
            </Snackbar>
        </>
    );
}

export default Account;
