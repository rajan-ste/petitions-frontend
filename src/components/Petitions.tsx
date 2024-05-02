import React from "react";
import SearchBar from "./common/SearchBar"
import axios from "axios";
import PetitionListObject from "./PetitionListObject";
import SelectMenu from "./common/SelectMenu";
import RadioMenu from "./common/RadioMenu";
import { Alert, AlertTitle, Box, Grid } from "@mui/material";

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

    const generatePriceOptions = () => {
        let prices = [];
        for (let i = 0; i <= 150; i += 15) {
            prices.push("$" + i.toString());
        }
        return prices;
    };

    const sortOptions: string[] = [
        "Alphabetical A-Z",
        "Alphabetical Z-A",
        "Cost Ascending",
        "Cost Descending",
        "Creation Date Oldest",
        "Creation Date Newest"
    ];
    
    const priceOptions = generatePriceOptions();

    return (
        <div>
            <h1>Petitions</h1>
            <div style={{ display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          height: '20vh'}}>
                <SearchBar />
            <div style={{ display: 'flex', marginLeft: '3vh'}}>
                <SelectMenu categories={categories} />
            </div>
            <div style={{ display: 'flex', marginLeft: '3vh' }}>
                <RadioMenu options={priceOptions} title="Max Cost" />
            </div>
            <div style={{ display: 'flex', marginLeft: '3vh' }}>
                <RadioMenu options={sortOptions} title="Sort By" />
            </div>
                
            </div>
            {errorFlag?
            <Alert severity = "error">
            <AlertTitle> Error </AlertTitle>
            { errorMessage }
            </Alert>: ""}
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    { petition_rows() }
                </Grid>
            </Box>
            
        </div>
    )
}

export default Petitions