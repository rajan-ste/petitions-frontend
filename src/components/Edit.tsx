import React, { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, InputAdornment, List, TextField } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import PetitionObject from "./common/PetitionObject";
import SupportTierObject from "./common/SupportTierObject";
import useStore from "../store";
import RadioMenu from './common/RadioMenu'; 
import AddIcon from '@mui/icons-material/Add';
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

const Edit = () => {
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

    const [categories, setCategories] = useState<Array<Category>>([]);
    const [errorFlag, setErrorFlag] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditTierDialog, setOpenEditTierDialog] = useState(false);
    const [openAddTierDialog, setOpenAddTierDialog] = useState(false);
    const [openEditImageDialog, setOpenEditImageDialog] = useState(false);
    const [tierToEdit, setTierToEdit] = useState<SupportTier | null>(null);
    const [tierToDelete, setTierToDelete] = useState<SupportTier | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const { id } = useParams();
    const { token } = useStore();

    const handleOpenEditDialog = (petition: Petition) => {
        setFormValues({
            title: petition.title,
            description: petition.description,
            categoryId: petition.categoryId
        });
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setErrorFlag(false);
        setErrorMessage('');
    };

    const handleOpenDeleteDialog = (tier: SupportTier) => {
        setTierToDelete(tier);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setTierToDelete(null);
        setErrorFlag(false);
        setErrorMessage('');
    };

    const handleConfirmDelete = () => {
        if (!tierToDelete) return;

        axios.delete(`http://localhost:4941/api/v1/petitions/${id}/supportTiers/${tierToDelete.supportTierId}`, {
            headers: {
                "X-Authorization": token
            },
        })
            .then((response) => {
                setPetition((prevPetition) => ({
                    ...prevPetition,
                    supportTiers: prevPetition.supportTiers.filter(t => t.supportTierId !== tierToDelete.supportTierId)
                }));
                handleCloseDeleteDialog();
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });
    };

    const handleOpenEditTierDialog = (tier: SupportTier) => {
        setTierToEdit(tier);
        setFormValuesTier({
            title: tier.title,
            description: tier.description,
            cost: tier.cost
        });
        setOpenEditTierDialog(true);
    };

    const handleCloseEditTierDialog = () => {
        setOpenEditTierDialog(false);
        setTierToEdit(null);
        setErrorFlag(false);
        setErrorMessage('');
    };

    const handleConfirmEditTier = () => {
        if (!tierToEdit) return;

        axios.patch(`http://localhost:4941/api/v1/petitions/${id}/supportTiers/${tierToEdit.supportTierId}`, {
            title: formValuesTier.title,
            description: formValuesTier.description,
            cost: formValuesTier.cost
        }, {
            headers: {
                "X-Authorization": token
            },
        })
            .then((response) => {
                setPetition((prevPetition) => ({
                    ...prevPetition,
                    supportTiers: prevPetition.supportTiers.map(t => 
                        t.supportTierId === tierToEdit.supportTierId ? { ...t, ...formValuesTier } : t
                    )
                }));
                handleCloseEditTierDialog();
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });
    };

    const handleOpenAddTierDialog = () => {
        setFormValuesTier({
            title: '',
            description: '',
            cost: 0
        });
        setOpenAddTierDialog(true);
    }

    const handleCloseAddTierDialog = () => {
        setOpenAddTierDialog(false);
        setTierToEdit(null);
        setErrorFlag(false);
        setErrorMessage('');
    };

    const handleConfirmAddTier = () => {
        axios.put(`http://localhost:4941/api/v1/petitions/${id}/supportTiers`, {
            title: formValuesTier.title,
            description: formValuesTier.description,
            cost: formValuesTier.cost
        }, {
            headers: {
                "X-Authorization": token
            },
        })
            .then((response) => {
                window.location.reload(); 
            })
            .catch((error) => {
                setErrorFlag(true);
                setErrorMessage(error.response.statusText);
            });
    };

    const handleOpenEditImageDialog = () => {
        setOpenEditImageDialog(true);
    };

    const handleCloseEditImageDialog = () => {
        setOpenEditImageDialog(false);
        setFile(null);
        setErrorFlag(false);
        setErrorMessage('');
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleConfirmEditImage = () => {
        if (!file) return;

        axios.put(`http://localhost:4941/api/v1/petitions/${id}/image`, file, {
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

    const editPetition = () => {
        axios.patch(`http://localhost:4941/api/v1/petitions/${id}`, {
            title: formValues.title,
            description: formValues.description,
            categoryId: formValues.categoryId
        }, {
            headers: {
                'X-Authorization': token
            }
        })
            .then((response) => {
                setPetition({
                    ...petition,
                    title: formValues.title,
                    description: formValues.description,
                    categoryId: formValues.categoryId
                });
                handleCloseEditDialog();
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    setErrorFlag(true);
                    setErrorMessage("Petition title already exists");
                } else {
                    setErrorFlag(true);
                    setErrorMessage(error.response.statusText);
                }
            });
    };

    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        categoryId: 0
    });

    const [formValuesTier, setFormValuesTier] = useState({
        title: '',
        description: '',
        cost: 0
    });

    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: name === "categoryId" ? Number(value) : value
        });
    };

    const handleInputChangeTier = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        setFormValuesTier({
            ...formValuesTier,
            [name]: name === "cost" ? Number(value) : value
        });
    };

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        editPetition();
    };

    useEffect(() => {
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
    }, [id]);

    useEffect(() => {
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
    }, []);

    const tier_rows = () => petition.supportTiers.map((tier: SupportTier) => {
        return (
            <SupportTierObject key={tier.supportTierId} tier={tier} edit={true} onDelete={() => handleOpenDeleteDialog(tier)} onEdit={() => handleOpenEditTierDialog(tier)} />
        )
    });

    return (
        <>
            {petition.petitionId > 0 && (
                <>
                    <Button onClick={handleOpenEditImageDialog}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 5, mr: 3 }}>Change Image
                    </Button>
                    <Button onClick={() => handleOpenEditDialog(petition)}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 5 }}>Edit Details
                    </Button>
       
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
                            <Button variant="contained" sx={{ m: 5 }} onClick={handleOpenAddTierDialog}>
                                <AddIcon fontSize="large" />
                            </Button>
                        </Grid>
                    </Box>
                    <Dialog
                        open={openEditDialog}
                        onClose={handleCloseEditDialog}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Edit Petition Details"}
                        </DialogTitle>
                        <DialogContent>
                            <Grid item sm={12} lg={4}>
                                <Box
                                    component="form"
                                    id="edit-petition-form" // Ensure form has an id
                                    onSubmit={handleSubmit}
                                    sx={{
                                        '& .MuiTextField-root': {
                                            m: 1,
                                        },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        name="title"
                                        label="Title"
                                        value={formValues.title}
                                        onChange={handleInputChange}
                                        fullWidth
                                    />
                                    <TextField
                                        name="description"
                                        label="Description"
                                        value={formValues.description}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={4}
                                        fullWidth
                                    />
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        width: '100%', 
                                        mt: 2,
                                    }}>
                                        <RadioMenu
                                            options={categories.map(category => ({
                                                label: category.name,
                                                code: category.categoryId.toString()
                                            }))}
                                            title="Change Category"
                                            onInputChangeStr={(value: string) => setFormValues({ ...formValues, categoryId: Number(value) })}
                                        />
                                    </Box>
                                    {errorFlag ? <Alert severity="error">{errorMessage}</Alert> : ""}
                                </Box>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditDialog}>Cancel</Button>
                            <Button variant="outlined" color="primary" type="submit" form="edit-petition-form">
                                Edit
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={openDeleteDialog}
                        onClose={handleCloseDeleteDialog}
                        aria-labelledby="delete-tier-dialog-title"
                        aria-describedby="delete-tier-dialog-description"
                    >
                        <DialogTitle id="delete-tier-dialog-title">
                            {"Delete Support Tier"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="delete-tier-dialog-description">
                                Are you sure you want to delete this support tier?
                            </DialogContentText>
                            {errorFlag ? <Alert severity="error">{errorMessage}</Alert> : ""}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                            <Button variant="outlined" color="error" onClick={handleConfirmDelete}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={openEditTierDialog}
                        onClose={handleCloseEditTierDialog}
                        aria-labelledby="edit-tier-dialog-title"
                        aria-describedby="edit-tier-dialog-description"
                    >
                        <DialogTitle id="edit-tier-dialog-title">
                            {"Edit Support Tier"}
                        </DialogTitle>
                        <DialogContent>
                            <Grid item sm={12} lg={4}>
                                <Box
                                    component="form"
                                    id="edit-tier-form"
                                    onSubmit={(event) => { event.preventDefault(); handleConfirmEditTier(); }}
                                    sx={{
                                        '& .MuiTextField-root': {
                                            m: 1,
                                        },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        name="title"
                                        label="Title"
                                        value={formValuesTier.title}
                                        onChange={handleInputChangeTier}
                                        fullWidth
                                    />
                                    <TextField
                                        name="description"
                                        label="Description"
                                        value={formValuesTier.description}
                                        onChange={handleInputChangeTier}
                                        multiline
                                        rows={4}
                                        fullWidth
                                    />
                                    <TextField
                                        name="cost"
                                        label="Cost"
                                        type="number"
                                        value={formValuesTier.cost}
                                        onChange={handleInputChangeTier}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                          }}
                                    />
                                    {errorFlag ? <Alert severity="error">{errorMessage}</Alert> : ""}
                                </Box>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditTierDialog}>Cancel</Button>
                            <Button variant="outlined" color="primary" type="submit" form="edit-tier-form">
                                Edit
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={openAddTierDialog}
                        onClose={handleCloseAddTierDialog}
                        aria-labelledby="add-tier-dialog-title"
                        aria-describedby="add-tier-dialog-description"
                    >
                        <DialogTitle id="add-tier-dialog-title">
                            {"Add Support Tier"}
                        </DialogTitle>
                        <DialogContent>
                            <Grid item sm={12} lg={4}>
                                <Box
                                    component="form"
                                    id="add-tier-form"
                                    onSubmit={(event) => { event.preventDefault(); handleConfirmAddTier(); }}
                                    sx={{
                                        '& .MuiTextField-root': {
                                            m: 1,
                                        },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        name="title"
                                        label="Title"
                                        value={formValuesTier.title}
                                        onChange={handleInputChangeTier}
                                        fullWidth
                                    />
                                    <TextField
                                        name="description"
                                        label="Description"
                                        value={formValuesTier.description}
                                        onChange={handleInputChangeTier}
                                        multiline
                                        rows={4}
                                        fullWidth
                                    />
                                    <TextField
                                        name="cost"
                                        label="Cost"
                                        type="number"
                                        value={formValuesTier.cost}
                                        onChange={handleInputChangeTier}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                          }}
                                    />
                                    {errorFlag ? <Alert severity="error">{errorMessage}</Alert> : ""}
                                </Box>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseAddTierDialog}>Cancel</Button>
                            <Button variant="outlined" color="primary" type="submit" form="add-tier-form">
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={openEditImageDialog}
                        onClose={handleCloseEditImageDialog}
                        aria-labelledby="edit-image-dialog-title"
                        aria-describedby="edit-image-dialog-description"
                    >
                        <DialogTitle id="edit-image-dialog-title">
                            {"Edit Petition Image"}
                        </DialogTitle>
                        <DialogContent>
                            <Grid item sm={12} lg={4}>
                                <Box
                                    component="form"
                                    id="edit-image-form"
                                    onSubmit={(event) => { event.preventDefault(); handleConfirmEditImage(); }}
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
                                        Upload Petition Photo
                                        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                                    </Button>
                                    {file ? <p>{file.name}</p> : ""}
                                    {errorFlag ? <Alert severity="error">{errorMessage}</Alert> : ""}
                                </Box>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseEditImageDialog}>Cancel</Button>
                            <Button variant="outlined" color="primary" type="submit" form="edit-image-form">
                                Upload
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
};

export default Edit;
