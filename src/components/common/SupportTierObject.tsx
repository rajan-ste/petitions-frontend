import { Box, Button, Grid, Paper, styled } from "@mui/material";
import React from "react";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

interface ISupportTierProps {
    tier: SupportTier
}

const SupportTierObject = ({ tier }: ISupportTierProps) => {
    const [sTier] = React.useState<SupportTier>(tier);

    return (
        <Grid item xs={3}>
            <Item>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '300px',
                        maxHeight: '300px',
                        padding: 2
                    }}
                >
                    <Box>
                    <h2 style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        height: '3em', 
                        lineHeight: '1.5em', 
                    }}>{sTier.title}</h2>
                        <p style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3, // Adjust the number of lines
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '4.5em',  // Based on line height, adjust accordingly
                        }}>
                            {sTier.description}
                        </p>
                    </Box>
                    <Box>
                        <p>{sTier.cost > 0 ? `$${sTier.cost}` : 'Free'}</p>
                        <Button>View</Button>
                    </Box>
                </Box>
            </Item>
        </Grid>
    );
}



export default SupportTierObject;