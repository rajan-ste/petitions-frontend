import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import useStore from "../store";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import axios from "axios";
import PetitionListObject from "./common/PetitionListObject";

const Account = () => {
    const { delToken, token, userId } = useStore();
    const [user, setUser] = React.useState<User>({ firstName: '', lastName: '', email: ''});
    const [myPetitions, setMyPetitions] = React.useState<Array<PetitionList>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

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

    const my_petition_rows = () => myPetitions.map((petition: PetitionList) => <PetitionListObject key={ petition.petitionId } petition={petition} />)
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
                    First Name: <Typography component="span">{user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}</Typography>
                </Typography>
                <Typography variant="h6" component="div">
                    Last Name: <Typography component="span">{user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}</Typography>
                </Typography>
                <Typography variant="h6" component="div">
                    Email: <Typography component="span">{user.email}</Typography>
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
                    { myPetitions.length > 0 ?  my_petition_rows() : "You have no petitions" }
                </Grid>
            </Box>

            
        </>
    )
}

export default Account;
