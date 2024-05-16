import React from "react";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { Avatar, Box, Button, Grid, Link, Paper, styled } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {Link as RouterLink} from 'react-router-dom';

interface IPetitionListProps {
    petition: PetitionList,
    delBool?: boolean,
    editBool?: boolean,
    delToggle: () => void
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
const PetitionListObject = (props: IPetitionListProps) => {
    const [petition] = React.useState<PetitionList>(props.petition);
    const [imageError, setImageError] = React.useState(false);

    const date = new Date(petition.creationDate);

    // Convert to New Zealand Time and format
    const nztFormatted = date.toLocaleString("en-NZ", {
        timeZone: "Pacific/Auckland",
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const handleImageError = () => {
      setImageError(true);
    };

    return (
        <Grid item xs={12} lg={6}>
        <Item>
            <Box sx={{ display: 'flex', 
                       flexDirection: 'row', 
                       alignItems: 'center', 
                       justifyContent: 'space-between', 
                       width: '100%',
                       minHeight: {lg: '31vh'} }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 'auto' }}>
                    <Box sx={{ float: 'left', padding: 0 }}>
                        {imageError ? (
                            <div><ImageNotSupportedIcon sx={{ fontSize: '12.5rem' }} /></div>
                        ) : (
                            <img 
                                src={`http://localhost:4941/api/v1/petitions/${petition.petitionId}/image`} 
                                alt={petition.title} 
                                width={'190vh'}
                                onError={handleImageError}
                            />
                        )}
                    </Box>
                    <Box sx={{ textAlign: 'left', marginLeft: '5vh' }}>
                        <h2 style={{ color: 'black' }}>{petition.title}</h2>
                        <h3>Created on: {nztFormatted}</h3>
                        <h3>Category: {petition.category}</h3>
                        <h3>Supporting Cost: {petition.supportingCost != null ? `$${petition.supportingCost}` : `No Support Tiers`}</h3>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, paddingRight: '10px' }}>
                                {petition.ownerFirstName + " " + petition.ownerLastName}
                            </h3>
                            <Avatar sx={{ mb: 0 }} alt={petition.ownerFirstName + " " + petition.ownerLastName} src={`http://localhost:4941/api/v1/users/${petition.ownerId}/image`} />
                        </Box>
                    </Box>
                </Box>
                <Box >
                    <Link 
                        href={`/petitions/${petition.petitionId}`} 
                        sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowForwardIosIcon fontSize="large" />
                    </Link>
                </Box>
                {props.delBool ?
                <Box sx={{ alignSelf: 'flex-end' }} onClick={() => props.delToggle()}>
                    <Button>
                        <DeleteIcon color="warning" fontSize="large" />
                    </Button>
                </Box> : "" }
                {props.editBool ?
                <Box sx={{ alignSelf: 'flex-end' }}>
                        <Button component={RouterLink} to={`/petitions/${petition.petitionId}/edit`}>
                            <EditIcon fontSize="large" />
                        </Button>
                </Box> : "" }
            </Box>
        </Item>
    </Grid>
    
      );
    };

export default PetitionListObject;