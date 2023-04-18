import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {allExamples} from "./config";
import {Button} from "@mui/material";

export default function SimpleAccordion({handleClick}: {handleClick: any}) {
    return (
        <div>
            {
                allExamples.map(key => {
                        // @ts-ignore
                    return (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{key.title}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {key.content}
                                    </Typography>
                                    {/*// @ts-ignore*/}
                                    <Button sx={{ml: 'auto'}} value={key.content} onClick={ev => handleClick(ev.target.value)} variant={"contained"}>Use sample text</Button>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }
                )
            }
        </div>
    );
}