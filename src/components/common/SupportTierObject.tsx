import { Box, Button, Grid, Paper, styled } from "@mui/material";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

interface ISupportTierProps {
    tier: SupportTier;
    edit: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    onView?: () => void; // Add the onView prop
}

const SupportTierObject = ({ tier, edit, onDelete, onEdit, onView }: ISupportTierProps) => {
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
                        {edit &&
                            <>
                                <Button sx={{ m: 1 }} onClick={onDelete}>
                                    <DeleteIcon color="warning" fontSize="large" />
                                </Button>
                                <Button sx={{ m: 1 }} onClick={onEdit}>
                                    <EditIcon fontSize="large" />
                                </Button>
                            </>
                        }
                        <h2 style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            height: '3em',
                            lineHeight: '1.5em',
                        }}>
                            {tier.title}
                        </h2>
                        <p style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '4.5em',
                        }}>
                            {tier.description}
                        </p>
                    </Box>
                    <Box>
                        <p>{tier.cost > 0 ? `$${tier.cost}` : 'Free'}</p>
                        {edit ? "" : <Button onClick={onView}>View</Button>}
                    </Box>
                </Box>
            </Item>
        </Grid>
    );
};

export default SupportTierObject;
