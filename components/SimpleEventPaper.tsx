import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Box, ListItemButton, ListItemText } from '@mui/material';
import { NotificationsActive } from '@mui/icons-material';
import type { Event } from '@the-orange-alliance/api/lib/cjs/models';
import { readableDate } from '../lib/utils/common';
import { useAppContext } from '../lib/toa-context';

interface SimpleEventPaperProps {
  event: Event;
}

const SimpleEventPaper: React.FC<SimpleEventPaperProps> = ({ event }) => {
  const { user } = useAppContext();
  const [notify, setNotify] = useState<boolean>(
    user?.notifyEvents.includes(event.eventKey) ?? false
  );

  useEffect(() => {
    if (user) setNotify(user.notifyEvents.includes(event.eventKey) ?? false);
  }, [user]);

  const secondaryText =
    event.startDate === event.endDate
      ? `${event.city}, ${event.stateProv ? event.stateProv + ', ' : ''} ${
          event.country
        } on ${readableDate(event.startDate)}`
      : `${event.city}, ${event.stateProv ? event.stateProv + ', ' : ''} ${
          event.country
        } from ${readableDate(event.startDate)} to ${readableDate(event.endDate)}`;

  // TODO: figure out LTR

  return (
    <NextLink href={`/events/${event.eventKey}/rankings`} passHref>
      <ListItemButton sx={{ pl: '1.25em' }}>
        {event.teamCount > 0 && (
          <Box
            sx={{
              bgcolor: 'primary.main',
              position: 'absolute',
              top: '0.75em',
              bottom: '0.75em',
              left: '0.5em',
              width: '0.25em',
              borderRadius: '2em'
            }}
          />
        )}
        <ListItemText
          primary={
            <>
              {event.fullEventName}
              {notify && <NotificationsActive sx={{ fontSize: 14, ml: 1, mb: '-2px' }} />}{' '}
            </>
          }
          secondary={secondaryText}
          sx={{ my: 0 }}
        />
      </ListItemButton>
    </NextLink>
  );
};

export default SimpleEventPaper;
