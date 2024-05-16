import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Box, Grid, List } from "@mui/material";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import PetitionObject from "./common/PetitionObject";
import SupportTierObject from "./common/SupportTierObject";
import SupporterListObject from "./common/SupporterListObject";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PetitionListObject from "./common/PetitionListObject";


const Petition = () => {
    const [petition, setPetition] = React.useState<Petition>({
        petitionId: 0, 
        title: "",
        creationDate: "",
        description: "",
        ownerFirstName: "",
        ownerLastName: "",
        numberOfSupporters: 0,
        moneyRaised: 0,
        ownerId: 0,
        categoryId: 0,
        supportTiers: [] 
    });
    const [supporters, setSupporters] = React.useState<Array<SupporterList>>([])
    const [similarPetitions, setSimilarPetitions] = React.useState<Array<PetitionList>>([]);
    const [categories, setCategories] = React.useState<Array<Category>>([]);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const { id } = useParams(); 

    React.useEffect(() => {
        const getPetition = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}`)
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                setPetition(response.data);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
        };
        getPetition();
    }, [id])

    React.useEffect(() => {
        const getSupporters = () => {
            axios.get(`http://localhost:4941/api/v1/petitions/${id}/supporters`)
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("")
                setSupporters(response.data);
            }, (error) => {
                setErrorFlag(true);
                setErrorMessage(error.toString());
            });
        };
        getSupporters();
    }, [id])

    React.useEffect(() => {
        if (petition.petitionId === 0) return;
    
        const fetchSimilarPetitions = async () => {
            try {
                const categoryResponse = await axios.get(`http://localhost:4941/api/v1/petitions?categoryIds=${petition.categoryId}`);
                const ownerResponse = await axios.get(`http://localhost:4941/api/v1/petitions?ownerId=${petition.ownerId}`);
    
                const allPetitions = [
                    ...categoryResponse.data.petitions,
                    ...ownerResponse.data.petitions
                ];
    
                // Create a set to filter out duplicate petitions by ID
                const uniquePetitions = new Set();
                const filteredPetitions: PetitionList[] = [];
    
                allPetitions.forEach(petition => {
                    if (!uniquePetitions.has(petition.petitionId)) {
                        uniquePetitions.add(petition.petitionId);
                        if (petition.petitionId !== parseInt(id as string, 10)) { // Ensure current petition is not included
                            filteredPetitions.push(petition);
                        }
                    }
                });
    
                setSimilarPetitions(filteredPetitions);
                setErrorFlag(false);
                setErrorMessage("");
            } catch (error) {
                setErrorFlag(true);
                setErrorMessage((error as Error).toString());
            }
        };
    
        fetchSimilarPetitions();
    }, [petition, id]); // Depends on both `petition` and `id` to avoid adding the current petition
    

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

    similarPetitions.forEach((simPetition) => {
        const category = categories.find(cat => cat.categoryId === simPetition.categoryId);
        const categoryName = category ? category.name : 'null'; 
        simPetition.category = categoryName;
    })

    const tier_rows = () => petition.supportTiers.map((tier: SupportTier) => <SupportTierObject key={ tier.supportTierId } tier={tier} />)

    const supporter_rows = () => supporters.map((supporter: SupporterList) => {
        const tierIndex = petition.supportTiers.findIndex(tier => tier.supportTierId === supporter.supportTierId);
        return (
            <SupporterListObject 
                key={supporter.supportId} 
                supporter={supporter} 
                supportTier={petition.supportTiers[tierIndex]} 
            />
        );
    });

    const togglePlaceholder = () => ""
    // const similarPetitionsSet = new Set(similarPetitions)
    // const similarPetitionsArr = Array.from(similarPetitionsSet).filter((pet) => pet.petitionId !== petition.petitionId)
    const similarPetition_rows = () => similarPetitions.map((petitionObj: PetitionList) => {
                                        return (
                                        <PetitionListObject 
                                            key={ petitionObj.petitionId } 
                                            petition={petitionObj}
                                            delToggle={() => togglePlaceholder} />
                                           
                                            );
                                        });
                                                        
    return (
        <>
            {errorFlag ? (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            ) : null}
            {petition.petitionId > 0 && (
                <>
                    <PetitionObject petition={petition} />
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh',
                            mt: { xs: '-55vh', lg: '-60vh' }
                        }}
                    >
                        <Grid
                            container
                            spacing={2}
                            sx={{ maxWidth: '300vh', justifyContent: 'center' }} 
                        >
                            {tier_rows()}
                        </Grid>
                    </Box>
                    <div style={{ marginTop: '-20vh' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Accordion sx={{ width: '60%' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    View Supporters
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {supporter_rows()}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                    </div>
                    <Box sx={{ flexGrow: 1 }}>
                        <div style={{ padding: '20px' }}>
                            <h2>Similar Petitions</h2>
                        </div>
                        <Grid container spacing={6} sx={{ padding: '10px' }}>
                            { similarPetition_rows() }
                        </Grid>
                    </Box>
                </>
            )}
        </>
    )
    
}

export default Petition;