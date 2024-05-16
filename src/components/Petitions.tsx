import React from "react";
import SearchBar from "./common/SearchBar"
import axios from "axios";
import PetitionListObject from "./common/PetitionListObject";
import SelectMenu from "./common/SelectMenu";
import RadioMenu from "./common/RadioMenu";
import PaginationButs from "./common/PaginationButs";
import { Alert, AlertTitle, Box, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";

const Petitions = () => {
    const [petitions, setPetitions] = React.useState<Array<PetitionList>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [catIds, setCatIds] = React.useState<Array<number>>([]);
    const [maxCost, setMaxCost] = React.useState("");
    const [sortOption, setSortOption] = React.useState("")
    const [dataCount, setDataCount] = React.useState(0);
    const itemsPerPage = 8;
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(query.get('page') || '1', 10);
    const startIndex = (page - 1) * itemsPerPage;

    React.useEffect(() => {
        const getPetitions = () => {
            let url = `http://localhost:4941/api/v1/petitions?startIndex=${startIndex}&count=${itemsPerPage}`;
            if (searchQuery) {url += `&q=${searchQuery}`}
            if (catIds.length > 0) {
                url += catIds.map(id => `&categoryIds=${id}`).join('');
            }
            if (maxCost !== "" && maxCost !== 'None') {url += `&supportingCost=${maxCost}`}
            if (sortOption ) {url += `&sortBy=${sortOption}`}
            axios.get(url)
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setPetitions(response.data.petitions);
                setDataCount(response.data.count);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
        };
        getPetitions();
        }, [setPetitions, startIndex, searchQuery, catIds, maxCost, sortOption]);

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
    
    const togglePlaceHolder = () => ""; // placeholder for delToggle since it can't be undefined
    const petition_rows = () => petitions.map((petition: PetitionList) => <PetitionListObject key={ petition.petitionId } petition={petition} delToggle={() => togglePlaceHolder} />)

    const generatePriceOptions = () => {
        const prices = [{ label: 'None', code: '' }]; 
        for (let i = 0; i <= 150; i += 15) {
            prices.push({
                label: `$${i}`, 
                code: i.toString(), 
            });
        }
        return prices;
    };

    const priceOptions = generatePriceOptions();
    
    const sortOptions = [
        { label: "Creation Date Oldest", code: "CREATED_ASC" },
        { label: "Creation Date Newest", code: "CREATED_DESC" },
        { label: "Alphabetical A-Z", code: "ALPHABETICAL_ASC" },
        { label: "Alphabetical Z-A", code: "ALPHABETICAL_DESC" },
        { label: "Cost Ascending", code: "COST_ASC" },
        { label: "Cost Descending", code: "COST_DESC" }
    ];
    
    const handleCategoryChange = (categoryId: number) => {
        setCatIds((prevCatIds) => {
            const index = prevCatIds.indexOf(categoryId);
            if (index > -1) {
                return prevCatIds.filter(id => id !== categoryId);
            } else {
                return [...prevCatIds, categoryId];
            }
        });
    };

    return (
        <div>
            <h1>Petitions</h1>
            <div style={{ display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          height: '20vh'}}>
                <SearchBar onSearchChange={setSearchQuery} />
                <div style={{ display: 'flex', marginLeft: '3vh'}}>
                    <SelectMenu categories={categories} onCategoryChange={handleCategoryChange}/>
                </div>
                <div style={{ display: 'flex', marginLeft: '3vh' }}>
                    <RadioMenu options={priceOptions} title="Max Cost" onInputChangeStr={setMaxCost} />
                </div>
                <div style={{ display: 'flex', marginLeft: '3vh' }}>
                    <RadioMenu options={sortOptions} title="Sort By" onInputChangeStr={setSortOption} />
                </div>
                
            </div>
            {errorFlag ?
            <Alert severity = "error">
            <AlertTitle> Error </AlertTitle>
            { errorMessage }
            </Alert> : ""}
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    { petition_rows() }
                </Grid>
            </Box>
            {petitions.length > 0 ?
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                    <PaginationButs itemsPerPage={itemsPerPage} count={dataCount} page={page}/>
                </div> : 
                <h2>{"No Petitions Found"}</h2>}
            
        </div>
    )
}

export default Petitions