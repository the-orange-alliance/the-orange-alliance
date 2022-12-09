import Link from 'next/link';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Team } from '@the-orange-alliance/api/lib/cjs/models';

interface IProps {
  team: Team;
}

const SimpleTeamPaper = ({ team }: IProps) => {
  const teamName = team.teamNameShort?.length > 0 ? team.teamNameShort : `Team #${team.teamKey}`;

  const location = `${team.city}, ${team.stateProv ? `${team.stateProv}, ` : ''}${team.country}`;

  return (
    <Link href={`/teams/${team.teamKey}`} passHref>
      <ListItem button component="a">
        <ListItemAvatar sx={{ fontWeight: 700, textAlign: 'center', mr: 2 }}>
          {team.teamKey}
        </ListItemAvatar>
        <ListItemText primary={teamName} secondary={location} />
      </ListItem>
    </Link>
  );
};

export default SimpleTeamPaper;
