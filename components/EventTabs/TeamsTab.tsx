import { List } from '@mui/material';
import { EventParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import SimpleTeamPaper from '../SimpleTeamPaper';

interface TeamsTabProps {
  teams: EventParticipant[];
}

const TeamsTab: React.FC<TeamsTabProps> = ({ teams }) => {
  return (
    <List sx={{ marginLeft: 2, marginRight: 2 }}>
      {teams.map((participant: EventParticipant) => (
        <SimpleTeamPaper key={participant.eventParticipantKey} team={participant.team} />
      ))}
    </List>
  );
};

export default TeamsTab;
