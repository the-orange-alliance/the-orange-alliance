import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { NotificationsActive } from '@mui/icons-material';
import { Team } from '@the-orange-alliance/api/lib/cjs/models';
import { useAppContext } from '@/lib/toa-context';

interface TeamItemProps {
  team: Team;
}

const TeamItem: React.FC<TeamItemProps> = ({ team }) => {
  const teamName = team.teamNameShort?.length > 0 ? team.teamNameShort : `Team #${team.teamKey}`;
  const location = `${team.city}, ${team.stateProv ? `${team.stateProv}, ` : ''}${team.country}`;
  const { user } = useAppContext();
  const [notify, setNotify] = useState<boolean>(user?.notifyTeams.includes(team.teamKey) ?? false);

  useEffect(() => {
    if (user) setNotify(user.notifyTeams.includes(team.teamKey) ?? false);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Link href={`/teams/${team.teamKey}`} passHref>
      <ListItemButton component="a">
        <ListItemAvatar sx={{ fontWeight: 700, textAlign: 'center', mr: 2 }}>
          {team.teamKey}
        </ListItemAvatar>
        <ListItemText
          primary={
            notify ? (
              <>
                {teamName}
                <NotificationsActive sx={{ fontSize: 14, ml: 1, mb: '-2px' }} />
              </>
            ) : (
              teamName
            )
          }
          secondary={location}
          sx={{ my: 0 }}
        />
      </ListItemButton>
    </Link>
  );
};

export default TeamItem;
