import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, List, Snackbar, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PetitionObject from "./common/PetitionObject";
import SupportTierObject from "./common/SupportTierObject";
import SupporterListObject from "./common/SupporterListObject";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PetitionListObject from "./common/PetitionListObject";
import useStore from "../store";

const Petition = () => {
    const [petition, setPetition] = useState<Petition>({
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
    const [supporters, setSupporters] = useState<Array<SupporterList>>([])
    const [similarPetitions, setSimilarPetitions] = useState<Array<PetitionList>>([]);
    const [categories, setCategories] = useState<Array<Category>>([]);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openSupportDialog, setOpenSupportDialog] = useState(false);
    const [selectedTier, setSelectedTier] = useState<SupportTier | null>(null);
    const [supportMessage, setSupportMessage] = useState<string>("");
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const { id } = useParams();
    const { token } = useStore();

    const handleOpenSupportDialog = (tier: SupportTier) => {
        setSelectedTier(tier);
        setOpenSupportDialog(true);
    };

    const handleCloseSupportDialog = () => {
        setOpenSupportDialog(false);
        setSelectedTier(null);
        setSupportMessage("");
        setErrorFlag(false);
        setErrorMessage("");
    };

    const handleSupportMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSupportMessage(event.target.value);
    };

    const handleSupportSubmit = () => {
        if (!selectedTier) return;
        if (supportMessage) {
            axios.post(`http://localhost:4941/api/v1/petitions/${id}/supporters`, {
                supportTierId: selectedTier.supportTierId,
                message: supportMessage
            }, {
                headers: {
                    'X-Authorization': token
                }
            })
            .then((response) => {
                setOpenSnackBar(true);
                handleCloseSupportDialog();
                window.location.reload();

            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setErrorFlag(true);
                    setErrorMessage("Please Login or Signup to support a petition");
                }
                else {
                    setErrorFlag(true);
                    setErrorMessage(error.response.statusText);
                }
            });
        }
        else {
            axios.post(`http://localhost:4941/api/v1/petitions/${id}/supporters`, {
                supportTierId: selectedTier.supportTierId,
            }, {
                headers: {
                    'X-Authorization': token
                }
            })
            .then((response) => {
                setOpenSnackBar(true);
                handleCloseSupportDialog();
                window.location.reload();
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    setErrorFlag(true);
                    setErrorMessage("Please Login or Signup to support a petition");
                }
                else {
                    setErrorFlag(true);
                    setErrorMessage(error.response.statusText);
                }
               
            });
        }

    };

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
    
                const uniquePetitions = new Set();
                const filteredPetitions: PetitionList[] = [];
    
                allPetitions.forEach(petition => {
                    if (!uniquePetitions.has(petition.petitionId)) {
                        uniquePetitions.add(petition.petitionId);
                        if (petition.petitionId !== parseInt(id as string, 10)) {
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
    }, [petition, id]);

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

    const tier_rows = () => petition.supportTiers.map((tier: SupportTier) => (
        <SupportTierObject key={tier.supportTierId} tier={tier} edit={false} onView={() => handleOpenSupportDialog(tier)} />
    ));

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
    const similarPetition_rows = () => similarPetitions.map((petitionObj: PetitionList) => (
        <PetitionListObject 
            key={petitionObj.petitionId} 
            petition={petitionObj}
            delToggle={() => togglePlaceholder} 
        />
    ));

    const handleSnackBarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackBar(false);
    };

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
                    <PetitionObject petition={petition}/>
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
                        <Grid container spacing={6} sx={{ padding: '10px', justifyContent: 'center', alignItems: 'center' }}>
                            { similarPetitions.length > 0 ? similarPetition_rows() : 
                            <p style={{ textAlign: 'center' }}>No similar petitions found</p> }
                        </Grid>
                    </Box>
                    <Dialog
                        open={openSupportDialog}
                        onClose={handleCloseSupportDialog}
                        aria-labelledby="support-dialog-title"
                        aria-describedby="support-dialog-description"
                    >
                        <DialogTitle id="support-dialog-title">
                            {"Support Petition"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="support-dialog-description">
                                {selectedTier && (
                                    <>
                                        <Typography variant="h6" sx={{ m: 1}}>{selectedTier.title}</Typography>
                                        <Typography variant="body1" sx={{ m: 1}}>{selectedTier.description}</Typography>
                                        <Typography variant="body1" sx={{ m: 1 }}>{selectedTier.cost > 0 ? `$${selectedTier.cost}` : 'Free'}</Typography>
                                        <TextField
                                            label="Message"
                                            multiline
                                            rows={4}
                                            value={supportMessage}
                                            onChange={handleSupportMessageChange}
                                            fullWidth
                                            margin="normal"
                                        />
                                    </>
                                )}
                                 {errorFlag ? <Alert severity="error">{errorMessage}</Alert> : ""}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseSupportDialog}>Cancel</Button>
                            <Button variant="outlined" color="primary" onClick={handleSupportSubmit}>
                                Support
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
                            Support action completed successfully
                        </Alert>
                    </Snackbar>
                </>
            )}
        </>
    );
}

export default Petition;
