import * as React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Button } from '@mui/material';
import { EventParticipant, Event } from '@the-orange-alliance/api/lib/cjs/models';
import SimpleTeamPaper from '../SimpleTeamPaper';

interface IProps {
  event: Event;
}

const TeamsTab = (props: IProps) => {
  const { teams } = props.event;

  return (
    <List sx={{ marginLeft: 2, marginRight: 2 }}>
      {teams.map((participant: EventParticipant) => (
        <SimpleTeamPaper key={participant.eventParticipantKey} team={participant.team} />
      ))}
    </List>
  );
};

export default TeamsTab;
