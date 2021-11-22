import * as React from "react";
import { List, ListItem, ListItemText, ListItemAvatar, Button } from "@mui/material";
import { EventParticipant, Event } from "@the-orange-alliance/api/lib/cjs/models";

interface IProps {
  event: Event
}

const TeamsTab = (props: IProps) => {
  const {teams} = props.event;

  return (
    <List>
      {teams.map((team: EventParticipant) => (
        <ListItem key={team.teamKey} component='a' button href={`/teams/${team.teamKey}`}>
          <ListItemAvatar>
            <Button disabled>{team.teamKey}</Button>
          </ListItemAvatar>
          <ListItemText
            primary={team.team.teamNameShort}
            secondary={`${team.team.city}, ${team.team.stateProv}, ${team.team.country}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TeamsTab;
