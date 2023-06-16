import React, { useState } from "react";
import "./App.css";
import { Box, Button, Grid, List, ListItem, Paper } from "@mui/material";
import SimpleAccordion from "./Samples";
import ResponsiveAppBar from "./ResponsiveAppBar";
import Container from "@mui/material/Container";
import { KwertyValidation, Match } from "./types";
import { MatchResult } from "./MatchResult";
import Typography from "@mui/material/Typography";
import {CircularProgress, Textarea} from "@mui/joy";
import RenderWord from "./RenderWord";

// const KWERTY_API = process.env.REACT_APP_KWERTY_API || "http://localhost:3500"
const KWERTY_API = "http://54.172.173.121:3500";

let sampleData: KwertyValidation = { error: null, metric_match: null };
function KwertyUI() {
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState<KwertyValidation>(sampleData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] =  useState('')
  const [expanded, setExpanded] = React.useState(false);

  const handleButtonClick = (sentence: string) => {
    setData(sampleData);
    setError(false);
    setInputText(sentence);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${KWERTY_API}/kwerty/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
        }),
      });

      if (!response.ok) {
        setError(true);
      }

      const result = await response.json();
      if (result.error) {
        setErrorMessage(result.error)
      }
      else{
        setData(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (event: any) => {
    setError(false);
    setData(sampleData)
    // const input = event.target as HTMLElement;
    setInputText(event.target.value);
  };

  const updateInputText = (updatedText: string) => {
    setInputText(updatedText);
  };

  const handleMatchChange =
    (panel: any) => (event: any, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const processInputText = (
    inputText: string,
    matches: Match[] | undefined
  ) => {
    let output: Array<string | JSX.Element> = [];

    inputText.split(" ").forEach((word) => {
      if (!matches) {
        output.push(word);
      } else {
        let foundMatch = false;

        matches.forEach((match) => {
          if (word === match.openai_extract.metric_value) {
            output.push(<RenderWord match={match} validity={match.validity} />);
            foundMatch = true; // Set the flag to true
          }
        });

        if (!foundMatch) {
          output.push(word);
        }
      }
    });

    return output;
  };

  console.log(data.metric_match)

  return (
    <Container>
      <ResponsiveAppBar />
      <Grid container spacing={2} paddingTop={4}>
        <Grid item lg={6} sm={12}>
            <Textarea
                style={{
                  height: "100%",
                  maxHeight: "340px",
                  minHeight: "340px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  fontSize: "1.4rem",
                }}
                value={inputText}
                onChange={(e) => {
                  handleTextChange(e);
                }}
            >
            </Textarea>
          <SimpleAccordion handleClick={handleButtonClick} />
        </Grid>

        {isLoading && !data.metric_match ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : data.metric_match ? (
          <Grid item lg={6} sm={3}>
            <Paper elevation={3}>
              <Box
                sx={{
                  bgcolor: "background.paper",
                  maxHeight: 360,
                  minHeight: 360,
                  overflow: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
                className="error-list"
              >
              <div>
                <Grid style={{
                  height: "100%",
                  border: "1px solid #ccc",
                  padding: "10px",
                  fontSize: "1.0rem",
                }}>
                  {processInputText(inputText, data.metric_match?.matches).map(
                      (word) => {
                        return <>{word} </>;
                      }
                  )}
                </Grid>
              </div>
                <nav aria-label="main mailbox folders">
                  {/* create a list of errors with max shown errors 5 */}
                  <List>
                    {data.metric_match!.matches.map((match, index) => (
                      <ListItem disablePadding key={index}>
                        <MatchResult
                          match={match}
                          text={inputText}
                          index={index}
                          handleMatchChange={handleMatchChange}
                          updateInputText={updateInputText}
                        />
                      </ListItem>
                    ))}
                  </List>
                </nav>
              </Box>
            </Paper>
          </Grid>
        ) : (
          <Grid item lg={5} sm={12}>
            <Paper elevation={3}>
              <Box
                sx={{
                  bgcolor: "background.paper",
                  maxHeight: 360,
                  minHeight: 360,
                  overflow: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
                className="error-list"
              >
                <nav aria-label="main mailbox folders">
                  <List>
                    <ListItem>
                      {error ? (
                        <Typography color="red">
                          {errorMessage ? errorMessage : "Something went wrong while calling the OpenAI API"}
                        </Typography>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          disabled={isLoading || !inputText}
                          onClick={handleSubmit}
                        >
                          Fact Check
                        </Button>
                      )}
                    </ListItem>
                  </List>
                </nav>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default KwertyUI;
