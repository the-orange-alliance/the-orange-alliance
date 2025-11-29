import NextLink from 'next/link';
import { Box, IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { NotificationsActive } from '@mui/icons-material';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import type { Event } from '@the-orange-alliance/api/lib/cjs/models';
import { getEventDescription } from '@/lib/utils/common';
import { useAppContext } from '@/lib/toa-context';

interface EventItemProps {
  event: Event;
  showWatch?: boolean;
}

const EventItem: React.FC<EventItemProps> = ({ event, showWatch }) => {
  const { user } = useAppContext();

  const isNotify = user?.notifyEvents.includes(event.eventKey);
  const hasData = event.teamCount > 0;

  return (
    <ListItem
      disablePadding
      secondaryAction={
        showWatch && (
          <NextLink href={`/live?e=${event.eventKey}`} passHref legacyBehavior>
            <IconButton edge="end" aria-label="Watch" color="success">
              <VideocamRoundedIcon />
            </IconButton>
          </NextLink>
        )
      }
    >
      <NextLink href={`/events/${event.eventKey}`} passHref legacyBehavior>
        <ListItemButton component="a" sx={{ pl: '1.25em' }}>
          {/* Data Indicator */}
          <Box
            sx={{
              bgcolor: theme =>
                hasData ? '#00b093' : theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
              position: 'absolute',
              top: '0.75em',
              bottom: '0.75em',
              left: '0.5em',
              width: '0.25em',
              borderRadius: '2em'
            }}
          />

          <ListItemText
            primary={
              <>
                {event.fullEventName}
                {isNotify && <NotificationsActive sx={{ fontSize: 14, ml: 1, mb: '-2px' }} />}{' '}
              </>
            }
            secondary={getEventDescription(event)}
            sx={{ my: 0 }}
          />
        </ListItemButton>
      </NextLink>
    </ListItem>
  );
};

export default EventItem;
