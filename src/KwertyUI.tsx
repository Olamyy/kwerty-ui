import React, {useState} from 'react';
import './App.css';
import {Box, Card, CardContent, CircularProgress, Grid} from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import {Send} from "@mui/icons-material";
import {ResultComponent} from "./ResultComponent";
import SimpleAccordion from "./Samples";
import Button from "@mui/material/Button";
import {Metrics} from "./types";


export interface APIResponse {
    metrics: APIResponseResult[];
}

export interface Validity {
    threshold: number;
    is_valid: boolean
}

export interface ExtractedInformation {
    metric: string;
    year: string;
    month: string;
    value: string;
}

export interface APIResponseResult {
    country: string,
    result: {
        summary: string;
        extracted_information: ExtractedInformation;
        validity: Validity
    }[]
}



function KwertyUI() {
    const [inputText, setInputText] = useState('');
    const [data, setData] = useState<Metrics>({metrics: []});
    const [isLoading, setIsLoading] = useState(false);

    const handleButtonClick = (sentence: string) => {
        setInputText(sentence)
    }
    const handleClick = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("http://localhost:8000/evaluate", {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(
                    {
                        text: inputText
                    }
                )
            });

            const result = await response.json();
            setData(result);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (sentence: string) => {
        setInputText(sentence);
    }


    return (
        <Box sx={{flexGrow: 1}} className="App">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        KwertyAI
                    </Typography>
                </Toolbar>
            </AppBar>
            <Grid container padding={10}>
                <Grid item xs={5.5} >
                    <>
                    <FormControl>
                        <Textarea
                            placeholder="Type something here…"
                            minRows={20}
                            value={inputText}
                            onChange={ev => handleChange(ev.target.value)}
                            endDecorator={
                                <Box sx={{
                                    display: 'flex',
                                    gap: 'var(--Textarea-paddingBlock)',
                                    pt: 'var(--Textarea-paddingBlock)',
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                    flex: 'auto',
                                }}>
                                    <Button sx={{ml: 'auto'}}
                                            onClick={handleClick}
                                            disabled={!inputText.length}
                                            startIcon={<Send/>}>Validate</Button>
                                </Box>
                            }
                        />
                    </FormControl>
                    <SimpleAccordion handleClick={handleButtonClick}/>
                    </>
                </Grid>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            {
                                isLoading && data.metrics.length === 0 ? (
                                        <Box sx={{ display: 'flex' }}>
                                            <CircularProgress />
                                        </Box>
                                        ) : (
                                            data.metrics.length > 0 ? (<ResultComponent text={inputText} metrics={data}/>) : (<Typography>Result will be shown here</Typography>)
                                )
                            }
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default KwertyUI;
