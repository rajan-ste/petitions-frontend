import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, Typography } from "@mui/material";
import useStore from "../store";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import axios from "axios";
import PetitionListObject from "./common/PetitionListObject";

const Account = () => {
    const { delToken, token, userId } = useStore();
    const [user, setUser] = React.useState<User>({ firstName: '', lastName: '', email: '' });
    const [myPetitions, setMyPetitions] = React.useState<Array<PetitionList>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
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
    }

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
                <Button component={RouterLink} to="/account/create" variant="contained" color="primary" sx={{ m: 5 }}>
                    Edit Account
                </Button>
                <Button onClick={delToken} variant="contained" color="primary">
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
