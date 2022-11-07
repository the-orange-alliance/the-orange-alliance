import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import { readableDate } from '../lib/utils/common';
import { useRouter } from 'next/router';
import { Box } from '@mui/system';

interface IProps {
  event: Event;
}

const SimpleEventPaper = (props: IProps) => {
  const { event } = props;
  const router = useRouter();

  const secondaryTxt =
    event.startDate === event.endDate
      ? `${event.city}, ${event.stateProv ? event.stateProv + ', ' : ''} ${
          event.country
        } on ${readableDate(event.startDate)}`
      : `${event.city}, ${event.stateProv ? event.stateProv + ', ' : ''} ${
          event.country
        } from ${readableDate(event.startDate)} to ${readableDate(event.endDate)}`;

  // TODO: figure out LTR

  function onClick() {
    router.push(`/events/${event.eventKey}/rankings`);
  }

  return (
    <ListItem button onClick={onClick}>
      {event.teamCount > 0 && <Box sx={{
        background: "primary.main",
        top: '4px',
        left: '4px',
        width: '4px',
        bottom: '4px',
        position: 'absolute',
        borderRadius: '4px'
      }}></Box>}
      <ListItemText primary={event.fullEventName} secondary={secondaryTxt} />
    </ListItem>
  );
};

export default SimpleEventPaper;
