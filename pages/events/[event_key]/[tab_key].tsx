import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Typography, Paper, Card } from '@mui/material';
import { CalendarToday, LocationOn, Public, VerifiedUser, Videocam } from '@mui/icons-material';
import { DataSource } from '@the-orange-alliance/api/lib/cjs/models/types/DataSource';
import { useTranslate } from '../../../i18n/i18n';
import {
  fetchEventData,
  IRawEventProps,
  useEventData
} from '../../../lib/page-helpers/event-helper';
import EventTabs from '../../../components/EventTabs/EventTabs';
import { readableDate } from '../../../lib/utils/common';
import { Box } from '@mui/system';

const EventPage: NextPage<IRawEventProps> = props => {
  const { event: eventData, streams } = useEventData(props);
  const t = useTranslate();

  const startDate = new Date(eventData.startDate); // TODO: Use moment.js

  return (
    <>
      <Box sx={{ margin: 2 }}>
        <Typography variant="h4">
          {startDate.getFullYear()} {eventData.fullEventName}
        </Typography>
        <Typography sx={{ margin: 1 }} variant={'body2'}>
          <CalendarToday fontSize="inherit" sx={{ marginRight: 1 }} />
          {readableDate(startDate)}
        </Typography>
        <Typography sx={{ margin: 1 }} variant={'body2'}>
          <LocationOn fontSize="inherit" sx={{ marginRight: 1 }} />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${eventData.venue}`}
            rel={'noreferrer'}
            target="_blank"
          >
            {eventData.venue}
          </a>
          , {eventData.city}, {eventData.stateProv}, {eventData.country}
        </Typography>
        {eventData.website && eventData.website.length > 0 && (
          <Typography sx={{ margin: 1 }} variant={'body2'}>
            <Public fontSize="inherit" sx={{ marginRight: 1 }} />
            <a href={eventData.website} target={'_blank'} rel={'noreferrer'}>
              {t('pages.event.view_website')}
            </a>
          </Typography>
        )}
        {streams && Array.isArray(streams) && streams.length > 0 && streams[0].isActive && (
          <Typography sx={{ margin: 1 }} variant={'body2'}>
            <Videocam fontSize="inherit" sx={{ marginRight: 1 }} />
            <Link href={`/live?e=${eventData.eventKey}`}>{t('pages.event.stream_available')}</Link>
          </Typography>
        )}
        {eventData.dataSource !== DataSource.Unknown && (
          <Typography sx={{ margin: 1 }} variant={'body2'}>
            <VerifiedUser fontSize="inherit" sx={{ marginRight: 1 }} />
            {t('pages.event.data_source.data_provided') + ' '}
            {eventData.dataSource === DataSource.DataSync ? (
              t('pages.event.data_source.data_sync')
            ) : eventData.dataSource === DataSource.EventArchive ? (
              t('pages.event.data_source.affiliate')
            ) : eventData.dataSource === DataSource.FIRST ? (
              <i> {t('pages.event.data_source.first')} </i>
            ) : (
              ''
            )}
          </Typography>
        )}
      </Box>

      <Card sx={{ margin: 2 }}>
        <EventTabs key={eventData.eventKey} event={eventData} streams={streams} />
      </Card>
    </>
  );
};

export default EventPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let eventData = {};
  try {
    eventData = await fetchEventData(String(params?.event_key));
    return { props: eventData };
  } catch (err) {
    return { notFound: true };
  }
};
