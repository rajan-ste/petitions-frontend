import React from "react";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { Avatar, Grid, Paper, styled } from "@mui/material";

interface IPetitionListProps {
    petition: PetitionList
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
            <Grid item xs={6}>
                <Item>
                    <div style={{ float: 'left', padding: 10}}>
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
                    </div>
                    <div>
                        <div style={{ textAlign: 'left', marginLeft: '25vh' }}>
                            <h2 style={{ color: 'black'}}>{petition.title}</h2>
                            <h3>Created on: {nztFormatted}</h3>
                            <h3>Category: {petition.category}</h3>
                            <h3>Supporting Cost: ${petition.supportingCost}</h3>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, paddingRight: '10px' }}>{petition.ownerFirstName + " " + petition.ownerLastName}</h3>
                                <Avatar sx={{ mb: 0 }} alt={petition.ownerFirstName + " " + petition.ownerLastName} src={`http://localhost:4941/api/v1/users/${petition.ownerId}/image`} />
                            </div>
                        </div>
                    </div>
                </Item>
            </Grid>
      );
    };

export default PetitionListObject;