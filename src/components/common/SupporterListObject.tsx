import { Accordion, AccordionDetails, AccordionSummary, List } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";

interface ISupporterListProps {
    supporter: SupporterList
}

const SupportListObject = (props: ISupporterListProps) => {
    const [supporter] = React.useState<SupporterList>(props.supporter)
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}> {/* Ensures the container is centered */}
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
                        <h1>{supporter.message}</h1>
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default SupportListObject;