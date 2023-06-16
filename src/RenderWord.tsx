import React, { useState } from "react";
import { Match, Validity } from "./types";
import { Button, Grid, Popover } from "@mui/material";
import Typography from "@mui/material/Typography";

interface RenderWordProps {
  match: Match;
  validity: Validity;
}

export default function RenderWord({ match, validity }: RenderWordProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  let color: string;

  if (validity.is_valid) {
    color = "#50C878";
  } else {
    if (validity.invalidity_reason === "INVALID_METRIC") {
      color = "#ef2850";
    } else {
      color = "#FFBF00";
    }
  }

  return (
    <>
      <u
        style={{ color: color }}
        aria-describedby={id}
        color="primary"
        onClick={handleClick}
      >{`${match.openai_extract.metric_value}   `}</u>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div
          contentEditable
          style={{
            height: "50%",
            maxHeight: "50px",
            minHeight: "50px",
            border: "1px solid #ccc",
            fontSize: "1.4rem",
          }}
        >
          {match.validity.is_valid ? (
            <Typography>
              According to the {match.kwerty_validation.source},
              <b>{match.kwerty_validation.value}</b> is the correct number for
              the <b>{match.kwerty_validation.indicator}</b> for{" "}
              {match.kwerty_validation.country} in{" "}
              {match.openai_extract.metric_month}{" "}
              {match.openai_extract.metric_year}.
            </Typography>
          ) : match.validity.invalidity_reason === "INVALID_METRIC" ? (
            <Typography>
              According to the {match.kwerty_validation.source}, the{" "}
              <b>{match.kwerty_validation.indicator}</b> for{" "}
              {match.kwerty_validation.country} in{" "}
              {match.openai_extract.metric_month}{" "}
              {match.openai_extract.metric_year} was{" "}
              <b>{match.kwerty_validation.value}</b>
            </Typography>
          ) : (
            <Typography>
              We do not have insufficient data to validate this. Either the
              month, year or some other value is missing. Please check.
            </Typography>
          )}
        </div>
        <Grid item>
          <Button
            sx={{ margin: 1 }}
            variant="contained"
            color="primary"
            href={match.kwerty_validation ? match.kwerty_validation.source: "#"}
          >
            Go to source
          </Button>
        </Grid>
      </Popover>
    </>
  );
}
