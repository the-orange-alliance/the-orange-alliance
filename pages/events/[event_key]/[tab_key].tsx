import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { Typography, Card, Select, MenuItem, TextField } from '@mui/material';
import {
  CalendarToday,
  Link,
  LocationOn,
  Public,
  VerifiedUser,
  Videocam
} from '@mui/icons-material';
import { DataSource } from '@the-orange-alliance/api/lib/cjs/models/types/DataSource';
import { useTranslate } from '../../../i18n/i18n';
import {
  fetchEventData,
  IRawEventProps,
  useEventData
} from '../../../lib/page-helpers/event-helper';
import EventTabs from '../../../components/EventTabs/EventTabs';
import { getEventDescription, readableDate } from '../../../lib/utils/common';
import { Box } from '@mui/system';
import { ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../../components/seo';
import { createOpengraphImageUrl } from '../../../lib/opengraph';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';

const EventPage: NextPage<IRawEventProps> = props => {
  const { event: eventData, streams, otherDivisions: divs, ogImage } = useEventData(props);
  const t = useTranslate();
  const router = useRouter();

  const startDate = new Date(eventData.startDate); // TODO: Use moment.js

  const handleDivisionJump = (event: ChangeEvent<any>) => {
    const toGo = `/events/${event.target.value}/rankings`;
    router.push(toGo);
  };

  return (
    <>
      <SEO
        title={`${startDate.getFullYear()} ${eventData.fullEventName}`}
        description={`Match results and rankings for the ${startDate.getFullYear()} ${eventData.fullEventName
          } in ${getEventDescription(eventData)}.`}
        ogImage={ogImage}
        url={`/events/${eventData.eventKey}`}
      />
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
            <NextLink href={`/live?e=${eventData.eventKey}`}>
              <a>{t('pages.event.stream_available')}</a>
            </NextLink>
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
        {divs.length > 0 && (
          <Box>
            <Typography sx={{ margin: 1, display: 'inline' }} variant={'body2'}>
              <Link fontSize="inherit" sx={{ marginRight: 1, marginTop: 1.5 }} />
            </Typography>

            <TextField
              select
              size={'small'}
              label={'Jump to Division'}
              sx={{ width: '250px' }}
              variant={'outlined'}
              onChange={handleDivisionJump}
            >
              {divs.map((div, index) => (
                <MenuItem key={div.eventKey} value={div.eventKey}>
                  {div.divisionName + ' '} Division
                </MenuItem>
              ))}
            </TextField>
          </Box>
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
  try {
    const props = await fetchEventData(String(params?.event_key));

    const event = new Event().fromJSON(props.event);

    try {
      props.ogImage = createOpengraphImageUrl({
        title: event.fullEventName,
        description1: event.getLocation(true),
        description2: event.getDateString()
      });
    } catch (err) {
      console.error("Error creating OpenGraph image for event " + event.eventKey, err);
    }

    return { props };
  } catch (err) {
    console.log(err)
    return { notFound: true };
  }
};
