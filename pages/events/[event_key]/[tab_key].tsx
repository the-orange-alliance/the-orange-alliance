import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { Typography, Card, Stack, Button, Link } from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Public as WebsiteIcon,
  VerifiedUser as SourceIcon,
  Videocam as StreamIcon
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
import { Box, Container } from '@mui/system';
import { ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import SEO from '../../../components/seo';
import { createOpengraphImageUrl } from '../../../lib/opengraph';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import MyTOAFavorite, { myTOAType } from '../../../components/MyTOAFavorite';

const EventPage: NextPage<IRawEventProps> = props => {
  const { event: eventData, streams, divisions, ogImage } = useEventData(props);
  const t = useTranslate();
  const router = useRouter();

  const startDate = new Date(eventData.startDate); // TODO: Use moment.js

  return (
    <>
      <SEO
        title={`${startDate.getFullYear()} ${eventData.fullEventName}`}
        description={`Match results and rankings for the ${startDate.getFullYear()} ${
          eventData.fullEventName
        } in ${getEventDescription(eventData)}.`}
        ogImage={ogImage}
        url={`/events/${eventData.eventKey}`}
      />

      <Container sx={{ py: 6 }}>
        <Typography variant="h1">
          {startDate.getFullYear()} {eventData.fullEventName}
        </Typography>

        <Box mt={2} ml={1}>
          <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
            <CalendarIcon fontSize="inherit" sx={{ mr: 1, position: 'relative', top: '0.125em' }} />
            {readableDate(startDate)}
          </Typography>
          <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
            <LocationIcon fontSize="inherit" sx={{ mr: 1, position: 'relative', top: '0.125em' }} />
            <Link
              href={`https://www.google.com/maps/search/?api=1&query=${eventData.venue}`}
              color="secondary"
              target="_blank"
              rel="noreferrer"
            >
              {eventData.venue}
            </Link>
            , {eventData.city}, {eventData.stateProv}, {eventData.country}
          </Typography>
          {eventData.website && (
            <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
              <WebsiteIcon
                fontSize="inherit"
                sx={{ mr: 1, position: 'relative', top: '0.125em' }}
              />
              <Link href={eventData.website} color="secondary" target="_blank" rel="noreferrer">
                {t('pages.event.view_website')}
              </Link>
            </Typography>
          )}
          {streams && Array.isArray(streams) && streams.length > 0 && streams[0].isActive && (
            <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
              <StreamIcon fontSize="inherit" sx={{ mr: 1, position: 'relative', top: '0.125em' }} />
              <NextLink href={`/live?e=${eventData.eventKey}`} passHref>
                <Link color="secondary">{t('pages.event.stream_available')}</Link>
              </NextLink>
            </Typography>
          )}
          {eventData.dataSource !== DataSource.Unknown && (
            <Typography sx={{ mb: 1 }} fontSize="0.875rem" fontWeight={500}>
              <SourceIcon fontSize="inherit" sx={{ mr: 1, position: 'relative', top: '0.125em' }} />
              {t('pages.event.data_source.data_provided') + ' '}
              {eventData.dataSource === DataSource.DataSync ? (
                t('pages.event.data_source.data_sync')
              ) : eventData.dataSource === DataSource.EventArchive ? (
                t('pages.event.data_source.affiliate')
              ) : eventData.dataSource === DataSource.FIRST ? (
                <em>{t('pages.event.data_source.first')}</em>
              ) : (
                ''
              )}
            </Typography>
          )}

          {divisions.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                display: 'inline-flex',
                py: 0.5,
                px: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                borderRadius: 1
              }}
            >
              {divisions.map((div, index) => {
                const isSelected = div.eventKey === eventData.eventKey;
                return (
                  <NextLink key={div.eventKey} href={`/events/${div.eventKey}/rankings`} passHref>
                    <Button
                      size="small"
                      color={isSelected ? 'secondary' : 'inherit'}
                      sx={{
                        color: isSelected ? undefined : 'text.secondary',
                        textAlign: 'center'
                      }}
                    >
                      {div.divisionName} Division
                    </Button>
                  </NextLink>
                );
              })}
            </Stack>
          )}
        </Box>

        <Card sx={{ mt: 4 }}>
          <EventTabs key={eventData.eventKey} event={eventData} streams={streams} />
        </Card>

        {/* myTOA FAB */}
        <MyTOAFavorite dataKey={eventData.eventKey} type={myTOAType.event} />
      </Container>
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
      console.error('Error creating OpenGraph image for event ' + event.eventKey, err);
    }

    return { props };
  } catch (err) {
    console.log(err);
    return { notFound: true };
  }
};
