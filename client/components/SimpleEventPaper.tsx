import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Event } from "@the-orange-alliance/api/lib/esm/models";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { readableDate } from "../util/common-utils";
import { useHistory } from "react-router-dom";

interface IProps {
  event: Event;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dataIndicator: {
      background: theme.palette.primary.main,
      top: "4px",
      left: "4px",
      width: "4px",
      bottom: "4px",
      position: "absolute",
      borderRadius: "4px"
    }
  })
);

const SimpleEventPaper = (props: IProps) => {
  const { event } = props;
  const classes = useStyles();
  const history = useHistory();

  const secondaryTxt =
    event.startDate === event.endDate
      ? `${event.city}, ${event.stateProv ? event.stateProv + ", " : ""} ${event.country} on ${readableDate(
          event.startDate
        )}`
      : `${event.city}, ${event.stateProv ? event.stateProv + ", " : ""} ${event.country} from ${readableDate(
          event.startDate
        )} to ${readableDate(event.endDate)}`;

  // TODO: figure out LTR

  function onClick() {
    history.push(`/events/${event.eventKey}`);
  }

  return (
    <ListItem button onClick={onClick}>
      {event.teamCount > 0 && <div className={classes.dataIndicator}></div>}
      <ListItemText primary={event.fullEventName} secondary={secondaryTxt} />
    </ListItem>
  );
};

export default SimpleEventPaper;
