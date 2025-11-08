import { Favorite, MoreVert, NotificationsActive, NotificationsOff } from '@mui/icons-material';
import {
  Card,
  Grid,
  Typography,
  List,
  ListItem,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Team, Event } from '@the-orange-alliance/api/lib/cjs/models';
import { useEffect, useState } from 'react';
import { useTranslate } from '@/i18n/i18n';
import { useAppContext } from '@/lib/toa-context';
import TOAUser from '@/lib/models/toa-user';
import { removeFromFavorite, setNotifications } from '@/providers/firebase-provider';
import TOAProvider from '@/providers/toa-provider';
import { myTOAType } from '@/components/ui/mytoa-favorite-button';
import EventItem from '@/components/ui/event-item';
import TeamItem from '@/components/ui/team-item';

const FavoritesCard = () => {
  const t = useTranslate();
  const { user } = useAppContext();

  const [events, setEvents] = useState<Event[]>();
  const [teams, setTeams] = useState<Team[]>();

  useEffect(() => {
    if (user) {
      // Fetch teams
      const teamPromises = user.favoriteTeams.map(t => TOAProvider.getAPI().getTeam(t));
      Promise.allSettled(teamPromises).then(results =>
        setTeams(
          (results.filter(e => e.status === 'fulfilled') as PromiseFulfilledResult<Team>[]).map(
            result => result.value
          )
        )
      );

      // Fetch events
      const eventPromises = user.favoriteEvents.map(e => TOAProvider.getAPI().getEvent(e));
      Promise.allSettled(eventPromises).then(results =>
        setEvents(
          (results.filter(e => e.status === 'fulfilled') as PromiseFulfilledResult<Event>[]).map(
            result => result.value
          )
        )
      );
    }
  }, [user]);

  return (
    <>
      {user && (
        <Card sx={{ p: 3 }}>
          <Grid container direction="row" spacing={2} style={{ width: '100%' }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ ml: 1, mb: 1 }} variant="h6">
                {t('general.teams')}
              </Typography>
              {teams && teams.length === 0 && (
                <Typography sx={{ marginLeft: 2 }} variant="subtitle2">
                  {t('no_data.teams')}
                </Typography>
              )}
              {teams && teams.length > 0 && (
                <List disablePadding dense>
                  {teams.map(t => (
                    <ListItem key={t.teamKey} sx={{ padding: 0 }}>
                      <TeamItem team={t} />
                      <FavoritesMenu dataKey={t.teamKey} type={myTOAType.team} user={user} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={{ ml: 1, mb: 1 }} variant="h6">
                {t('general.events')}
              </Typography>
              {teams && teams.length === 0 && (
                <Typography sx={{ marginLeft: 2 }} variant="subtitle2">
                  {t('no_data.teams')}
                </Typography>
              )}
              {events && events.length > 0 && (
                <List disablePadding dense>
                  {events.map(e => (
                    <ListItem key={e.eventKey} sx={{ padding: 0 }}>
                      <EventItem event={e} />
                      <FavoritesMenu dataKey={e.eventKey} type={myTOAType.event} user={user} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </Card>
      )}
    </>
  );
};

interface IMenuProps {
  user: TOAUser;
  type: myTOAType;
  dataKey: string;
}

const FavoritesMenu = ({ type, dataKey }: IMenuProps) => {
  const { user, setUser } = useAppContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const t = useTranslate();
  const [notify, setNotify] = useState(
    type === 'team' ? user?.notifyTeams.includes(dataKey) : user?.notifyEvents.includes(dataKey)
  );

  const removeFavorite = () => {
    // Check for myTOA User
    if (!user) return;
    // Update DB
    removeFromFavorite(dataKey, type).then(() => {
      // Revove from and update global user object
      if (type === myTOAType.event) {
        // Remove event from favorites
        const favEvents = user.favoriteEvents.filter(eventKey => eventKey !== dataKey);
        // Remove event from notifications (backend does this in the DB)
        const notiEvents = user.notifyEvents.filter(eventKey => eventKey !== dataKey);
        setUser(
          new TOAUser().fromJSON({
            ...user.toJSON(),
            favorite_events: favEvents,
            notify_events: notiEvents
          })
        );
      }
      if (type === myTOAType.team) {
        // Remove team from favorites
        const favTeams = user.favoriteTeams.filter(eventKey => eventKey !== dataKey);
        // Remove team from notifications (backend does this in the DB)
        const notiTeams = user.notifyTeams.filter(eventKey => eventKey !== dataKey);
        setUser(
          new TOAUser().fromJSON({
            ...user.toJSON(),
            favorite_teams: favTeams,
            notify_teams: notiTeams
          })
        );
      }
    });
  };

  const handleNotificationToggle = () => {
    if (!user) return;
    handleClose();

    // Add or remove from firebase, then update our local user model
    setNotifications(type, dataKey, !notify).then(() => {
      if (type === myTOAType.event) {
        if (notify) {
          user.notifyEvents = user.notifyEvents.filter(eventKey => eventKey !== dataKey);
        } else {
          user.notifyEvents.push(dataKey);
        }
      } else if (type === myTOAType.team) {
        if (notify) {
          user.notifyTeams = user.notifyTeams.filter(teamKey => teamKey !== dataKey);
        } else {
          user.notifyTeams.push(dataKey);
        }
      }
      // Update global state
      setUser(new TOAUser().fromJSON({ ...user.toJSON() }));
      // Update local state
      setNotify(!notify);
    });
  };

  return (
    <>
      <IconButton
        aria-controls={open ? 'favorites-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { boxShadow: 5 }
        }}
      >
        <MenuItem onClick={removeFavorite}>
          <ListItemIcon>
            <Favorite fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('general.remove_from_mytoa')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleNotificationToggle}>
          <ListItemIcon>
            {notify && <NotificationsActive fontSize="small" />}
            {!notify && <NotificationsOff fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {t(notify ? 'general.disable_notifications' : 'general.enable_notifications')}
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default FavoritesCard;
