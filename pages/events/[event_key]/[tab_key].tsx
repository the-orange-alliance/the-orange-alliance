import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Typography, Paper } from '@mui/material';
import { CalendarToday, LocationOn, Public, VerifiedUser, Videocam } from '@mui/icons-material';
import { DataSource } from '@the-orange-alliance/api/lib/cjs/models/types/DataSource';
import { useTranslate } from '../../../i18n/i18n';
import {
  getEventData,
  IRawEventProps,
  parseEventProps
} from '../../../lib/PageHelpers/eventHelper';
import EventTabs from '../../../components/EventTabs/EventTabs';

const EventPage: NextPage<IRawEventProps> = props => {
  const t = useTranslate();

  const { event: eventData, streams } = parseEventProps(props);

  function strToDate(dateString: string) {
    return new Date(Date.parse(dateString));
  }

  const startDate = strToDate(eventData.startDate);

  return (
    <>
      <Typography variant="h4">
        {startDate.getFullYear()} {eventData.fullEventName}
      </Typography>
      <Typography className={'m-1'} variant={'body2'}>
        <CalendarToday fontSize="inherit" className={'me-2'} />
        {t('month.' + startDate.getMonth())} {startDate.getDay()}, {startDate.getFullYear()}
      </Typography>
      <Typography className={'m-1'} variant={'body2'}>
        <LocationOn fontSize="inherit" className={'me-2'} />
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
        <Typography className={'m-1'} variant={'body2'}>
          <Public fontSize="inherit" className={'me-2'} />
          <a href={eventData.website} target={'_blank'} rel={'noreferrer'}>
            {t('pages.event.view_website')}
          </a>
        </Typography>
      )}
      {streams && Array.isArray(streams) && streams.length > 0 && streams[0].isActive && (
        <Typography className={'m-1'} variant={'body2'}>
          <Videocam fontSize="inherit" className={'me-2'} />
          <Link href={`/stream?e=${eventData.eventKey}`}>{t('pages.event.stream_available')}</Link>
        </Typography>
      )}
      {eventData.dataSource !== DataSource.Unknown && (
        <Typography className={'m-1'} variant={'body2'}>
          <VerifiedUser fontSize="inherit" className={'me-2'} />
          {eventData.dataSource === DataSource.DataSync
            ? t('pages.event.data_source.data_sync')
            : eventData.dataSource === DataSource.EventArchive
            ? t('pages.event.data_source.affiliate')
            : eventData.dataSource === DataSource.FIRST
            ? t('pages.event.data_source.first')
            : ''}
        </Typography>
      )}
      <Paper
        style={{
          marginTop: '16px'
        }}
      >
        <EventTabs key={eventData.eventKey} event={eventData} />
      </Paper>
    </>
  );
};

export default EventPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let eventData = {};
  try {
    eventData = await getEventData(String(params?.event_key));
    return { props: eventData };
  } catch (err) {
    return { notFound: true };
  }
};
