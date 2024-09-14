import { List } from '@mui/material';
import { EventParticipant } from '@the-orange-alliance/api/lib/cjs/models';
import TeamItem from '@/components/ui/team-item';

interface TeamsTabProps {
  teams: EventParticipant[];
}

const TeamsTab: React.FC<TeamsTabProps> = ({ teams }) => {
  return (
    <List sx={{ marginLeft: 2, marginRight: 2 }}>
      {teams.map((participant: EventParticipant) => (
        <TeamItem key={participant.eventParticipantKey} team={participant.team} />
      ))}
    </List>
  );
};

export default TeamsTab;
