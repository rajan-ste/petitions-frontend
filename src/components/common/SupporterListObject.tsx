import { Accordion, AccordionDetails, AccordionSummary, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";

interface ISupporterListProps {
    supporter: SupporterList
    supportTier: SupportTier
}

const SupportListObject = (props: ISupporterListProps) => {
    const [supporter] = React.useState<SupporterList>(props.supporter)
    const [supportTier] = React.useState<SupportTier>(props.supportTier)

    const date = new Date(supporter.timestamp);

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

    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar alt={supporter.supporterFirstName + supporter.supporterLastName} src={`http://localhost:4941/api/v1/users/${supporter.supporterId}/image`} />
                </ListItemAvatar>
                <ListItemText
                    primary={supportTier.title}
                    secondary={
                        <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="div"  // Change this from "span" to "div"
                                variant="body2"
                                color="text.primary"
                            >
                                {supporter.supporterFirstName + " " + supporter.supporterLastName}
                            </Typography>
                            {supporter.message ? " — " + supporter.message : ""}
                            <div style={{ paddingTop: '5px' }}>
                                {nztFormatted}
                            </div>
                        </React.Fragment>
                    }
                />
            </ListItem>
            <Divider variant="inset" component="li" />
        </>
    );
}

export default SupportListObject;