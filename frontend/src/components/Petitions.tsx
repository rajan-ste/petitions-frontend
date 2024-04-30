import React from "react";
import SearchBar from "./SearchBar"
import axios from "axios";
import PetitionListObject from "./PetitionListObject";
import { Box, Grid } from "@mui/material";

const Petitions = () => {
    const [petitions, setPetitions] = React.useState<Array<PetitionList>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    React.useEffect(() => {
    const getUsers = () => {
        axios.get('http://localhost:4941/api/v1/petitions')
        .then((response) => {
            setErrorFlag(false);
            setErrorMessage("");
            setPetitions(response.data.petitions);
        }, (error) => {
            setErrorFlag(true);
            setErrorMessage(error.toString());
        });
    };
    getUsers();
    }, [setPetitions]);

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

    petitions.forEach((petition) => {
        const category = categories.find(cat => cat.categoryId === petition.categoryId);
        const categoryName = category ? category.name : 'null'; 
        petition.category = categoryName;
    })
    const petition_rows = () => petitions.map((petition: PetitionList) => <PetitionListObject key={ petition.petitionId } petition={petition} />)


    return (
        <div>
            <h1>Petitions</h1>
            <div style={{ display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          height: '20vh' }}>
                <SearchBar />
            </div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    { petition_rows() }
                </Grid>
            </Box>
            
        </div>
    )
}

export default Petitions