import React from "react";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { Avatar, Box } from "@mui/material";

interface IPetitionProps {
    petition: Petition
}

const PetitionObject = ({ petition }: IPetitionProps) => {
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
        <Box>
            <h1>{petition.title}</h1>
            <Box sx={{  display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        marginTop: '-30vh',
                        padding: '5%',
                        maxWidth: {xs: '100%', lg: '1000px'}, 
                        marginLeft: {xs: 0, lg: '20%'}}}>
                <Box sx={{ float: 'left', paddingRight: '5%' }}>
                {petition.petitionId > 0 ? (
                    imageError ? (
                        <div><ImageNotSupportedIcon sx={{ fontSize: '12.5rem' }} /></div>
                    ) : (
                        <img 
                            src={`http://localhost:4941/api/v1/petitions/${petition.petitionId}/image`} 
                            alt={petition.title} 
                            width={'250vh'}
                            onError={handleImageError}
                        />
                    )
                ) : null}
                </Box>
                <Box sx={{ textAlign: 'left', marginLeft: '5vh' }}>
                    <h3>Created On: {nztFormatted}</h3>
                    <h3>Supporter Count: {petition.numberOfSupporters}</h3>
                    <h3>Total Raised: ${petition.moneyRaised}</h3>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, paddingRight: '10px' }}>
                            {petition.ownerFirstName + " " + petition.ownerLastName}
                        </h3>
                        <Avatar sx={{ mb: 0 }} alt={petition.ownerFirstName + " " + petition.ownerLastName} src={`http://localhost:4941/api/v1/users/${petition.ownerId}/image`} />
                    </Box> 
                    <h3>Description:</h3> <p style={{ margin: 0, wordWrap: 'break-word', whiteSpace: 'normal' }}>{petition.description}</p>
                </Box>
                <Box>
                </Box>
            </Box>
        </Box>
    )
}

export default PetitionObject;