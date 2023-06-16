import { Match } from "./types";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ListItemText from "@mui/material/ListItemText";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

type Props = {
  match: Match;
  text: string;
  index: number;
  handleMatchChange: any;
  updateInputText: any;
};

export function MatchResult({
  match,
  text,
  index,
  updateInputText,
  handleMatchChange,
}: Props) {
  let color: string;

  if (match.validity.is_valid) {
    color = "#50C878";
  } else {
    if (match.validity.invalidity_reason === "INVALID_METRIC") {
      color = "#ef2850";
    } else {
      color = "#FFBF00";
    }
  }

  return (
    <Accordion
      sx={{ width: "100%", margin: 0.5 }}
      onChange={handleMatchChange("panel" + index)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={"panel" + index + "bh-content"}
        id={"panel" + index + "bh-header"}
      >
        <ListItemButton>
          <ListItemIcon>
            <FiberManualRecordIcon sx={{ color: color }} />
          </ListItemIcon>
          <ListItemText primary={match.openai_extract.metric_value} />
        </ListItemButton>
      </AccordionSummary>
      <AccordionDetails>
        {match.validity.is_valid ? (
          <Typography>
            According to the {match.kwerty_validation.source},
            <b>{match.kwerty_validation.value}</b> is the correct number for the{" "}
            <b>{match.kwerty_validation.indicator}</b> for{" "}
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
            We do not have sufficient information to validate this. Either the
            month, year or some other value is missing. Please check.
          </Typography>
        )}
        {!match.validity.is_valid &&
        match.validity.invalidity_reason === "INVALID_METRIC" ? (
          <Button
            key={index}
            sx={{ margin: 1 }}
            variant="contained"
            color="primary"
            onClick={() => {
              if (
                match.validity.invalidity_reason === "INVALID_METRIC" &&
                match.kwerty_validation.value
              ) {
                let corrected_text = text.replace(
                  match.openai_extract.metric_value,
                  match.kwerty_validation.value
                );
                updateInputText(corrected_text);
              }
            }}
          >
            Correct this
          </Button>
        ) : (
          <></>
        )}
        <Button
          key={index}
          sx={{ margin: 1 }}
          variant="contained"
          color="primary"
          href={match.kwerty_validation ? match.kwerty_validation.source: "#"}
        >
          Go to source
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}
