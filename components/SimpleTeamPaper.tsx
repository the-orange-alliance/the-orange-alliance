import Link from 'next/link';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Team } from '@the-orange-alliance/api/lib/cjs/models';
import { useAppContext } from '../lib/toa-context';
import { NotificationsActive, NotificationsOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';

interface IProps {
  team: Team;
}

const SimpleTeamPaper = ({ team }: IProps) => {
  const teamName = team.teamNameShort?.length > 0 ? team.teamNameShort : `Team #${team.teamKey}`;
  const location = `${team.city}, ${team.stateProv ? `${team.stateProv}, ` : ''}${team.country}`;
  const { user } = useAppContext();
  const [notify, setNotify] = useState<boolean>(user?.notifyTeams.includes(team.teamKey) ?? false);

  useEffect(() => {
    if (user) setNotify(user.notifyTeams.includes(team.teamKey) ?? false);
  }, [user]);

  return (
    <Link href={`/teams/${team.teamKey}`} passHref>
      <ListItem button component="a">
        <ListItemAvatar sx={{ fontWeight: 700, textAlign: 'center', mr: 2 }}>
          {team.teamKey}
        </ListItemAvatar>
        <ListItemText
          primary={notify ? (<>{teamName}<NotificationsActive sx={{ fontSize: 14, ml: 1, mb: "-2px" }} /></>) : teamName}
          secondary={location}
        />
      </ListItem>
    </Link>
  );
};

export default SimpleTeamPaper;
