import {
  Favorite,
  FavoriteBorder,
  NotificationsActive,
  NotificationsOff
} from '@mui/icons-material';
import { SpeedDial, SpeedDialAction, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslate } from '../i18n/i18n';
import { useAppContext } from '../lib/toa-context';
import TOAUser from '../lib/TOAUser';
import {
  addToFavorite,
  cloudMessaging,
  removeFromFavorite,
  setNotifications
} from '../providers/FirebaseProvider';

export enum myTOAType {
  event = 'event',
  team = 'team'
}

interface IProps {
  type: myTOAType;
  dataKey: string;
}

const MyTOAFavorite = ({ type, dataKey: key }: IProps) => {
  const { user, setUser } = useAppContext();

  const calcIsFav = () =>
    !!(type === myTOAType.event
      ? user?.favoriteEvents?.includes(key)
      : user?.favoriteTeams?.includes(key));
  const calcNotiEnabled = () =>
    !!(
      user &&
      ((type === myTOAType.event && user.notifyEvents.includes(key)) ||
        (type === myTOAType.team && user.notifyTeams.includes(key)))
    );

  const t = useTranslate();
  const [open, setOpen] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState<boolean>(false);
  const [isNotificationsSupported, setIsNotificationsSupported] = useState<boolean>(false);

  // Update things when user updates
  useEffect(() => {
    if (user) {
      setIsFavorite(calcIsFav());
      setIsNotificationsEnabled(calcNotiEnabled());
    }
    cloudMessaging.isSupported().then(supported => {
      if (supported && Notification.permission === 'granted') {
        setIsNotificationsSupported(true);
      }
    });
  }, [user]);

  const handleFavoriteToggle = () => {
    //  Check if user is logged in
    if (!user) return;

    // Add or remove from firebase
    const promise = isFavorite ? removeFromFavorite(key, type) : addToFavorite(key, type);

    // Update DB
    promise.then(() => {
      // Revove from and update global user object
      if (type === myTOAType.event && isFavorite) {
        // Remove event from favorites
        const favEvents = user.favoriteEvents.filter(eventKey => eventKey !== key);
        // Remove event from notifications (backend does this in the DB)
        const notiEvents = user.notifyEvents.filter(eventKey => eventKey !== key);
        setUser(new TOAUser().fromJSON({ ...user.toJSON(), favorite_events: favEvents, notify_events: notiEvents }));
      } else if (type === myTOAType.event && !isFavorite) {
        // Add event to favorites
        if (!user.favoriteEvents.includes(key)) user.favoriteEvents.push(key);
        setUser(new TOAUser().fromJSON({ ...user.toJSON() }));
      } else if (type === myTOAType.team && isFavorite) {
        // Remove team from favorites
        const favTeams = user.favoriteTeams.filter(eventKey => eventKey !== key);
        // Remove team from notifications (backend does this in the DB)
        const notiTeams = user.notifyTeams.filter(eventKey => eventKey !== key);
        setUser(new TOAUser().fromJSON({ ...user.toJSON(), favorite_teams: favTeams, notify_teams: notiTeams }));
      } else if (type === myTOAType.team && !isFavorite) {
        // Add team to favorites
        if (!user.favoriteTeams.includes(key)) user.favoriteTeams.push(key);
        setUser(new TOAUser().fromJSON({ ...user.toJSON() }));
      }

      // Update state
      setIsFavorite(!isFavorite);
    });
  };

  const handleNotificationToggle = () => {
    if (!user) return;

    // Add or remove from firebase, then update our local user model
    setNotifications(type, key, !isNotificationsEnabled).then(() => {
      if (type === myTOAType.event) {
        if (isNotificationsEnabled) {
          user.notifyEvents = user.notifyEvents.filter(eventKey => eventKey !== key);
        } else {
          user.notifyEvents.push(key);
        }
      } else if (type === myTOAType.team) {
        if (isNotificationsEnabled) {
          user.notifyTeams = user.notifyTeams.filter(teamKey => teamKey !== key);
        } else {
          user.notifyTeams.push(key);
        }
      }
      // Update global state
      setUser(new TOAUser().fromJSON({ ...user.toJSON() }));
      // Update local state
      setIsNotificationsEnabled(!isNotificationsEnabled);
    });
  };

  if (!user) return null;

  return (
    <SpeedDial
      ariaLabel="myTOA Actions"
      icon={isFavorite ? <Favorite /> : <FavoriteBorder />}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onClick={() => setOpen(true)}
      FabProps={{
        onClick: e => {
          setOpen(true);
          handleFavoriteToggle();
        }
      }}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24
      }}
    >
      {isFavorite && isNotificationsSupported && (
        <SpeedDialAction
          onClick={handleNotificationToggle}
          icon={isNotificationsEnabled ? <NotificationsActive /> : <NotificationsOff />}
          tooltipTitle={t(
            isNotificationsEnabled ? 'general.disable_notifications' : 'general.enable_notifications'
          )}
          sx={{
            border: '1px solid',
            borderColor: 'divider'
          }}
        />
      )}
    </SpeedDial>
  );
};

export default MyTOAFavorite;
