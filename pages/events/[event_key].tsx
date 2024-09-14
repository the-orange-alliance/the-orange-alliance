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
import { useTranslate } from '../../i18n/i18n';
import { fetchEventData, IRawEventProps, useEventData } from '../../lib/page-helpers/event-helper';
import { getEventDescription, readableDate } from '../../lib/utils/common';
import { Box, Container } from '@mui/system';
import SEO from '../../components/seo';
import { createOpengraphImageUrl } from '../../lib/opengraph';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import MyTOAFavorite, { myTOAType } from '../../components/MyTOAFavorite';
import * as Tabs from '@radix-ui/react-tabs';
import {
  AdminTab,
  AlliancesTab,
  AwardsTab,
  InsightsTab,
  MatchesTab,
  RankingTab,
  TeamsTab
} from '../../components/EventTabs';
import { TabsList, TabsTrigger } from '../../components/ui/tabs';
import RankingsIcon from '@mui/icons-material/FormatListNumbered';
import MatchesIcon from '@mui/icons-material/SportsEsports';
import TeamsIcon from '@mui/icons-material/SupervisorAccount';
import AlliancesIcon from '@mui/icons-material/Anchor';
import AwardsIcon from '@mui/icons-material/EmojiEvents';
import InsightsIcon from '@mui/icons-material/Insights';
import AdminIcon from '@mui/icons-material/Tune';
import { useAppContext } from '../../lib/toa-context';
import { useMemo } from 'react';

const EventPage: NextPage<IRawEventProps> = props => {
  const { event: eventData, streams, divisions, ogImage } = useEventData(props);
  const t = useTranslate();
  const { user } = useAppContext();

  const startDate = new Date(eventData.startDate); // TODO: Use moment.js

  const isEventAdmin =
    user &&
    (user.level === 6 ||
      user.adminRegions.includes(eventData.regionKey) ||
      user.adminEvents.includes(eventData.eventKey) ||
      (eventData.leagueKey && user.adminLeagues.includes(eventData.leagueKey)));

  const firstTab = useMemo(() => {
    if (eventData.rankings.length > 0) return 'rankings';
    if (eventData.matches.length > 0) return 'matches';
    if (eventData.teams.length > 0) return 'teams';
    if (eventData.alliances.length > 0) return 'alliances';
    if (eventData.awards.length > 0) return 'awards';
    if (eventData.insights.filter(insights => insights).length > 0) return 'insights';
    if (isEventAdmin) return 'admin';
    return null;
  }, [eventData, isEventAdmin]);

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

        <Box mt={2} mb={4} ml={1}>
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
                  <NextLink key={div.eventKey} href={`/events/${div.eventKey}`} passHref>
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

        <Tabs.Root defaultValue={firstTab || ''}>
          {firstTab && (
            <TabsList>
              {eventData.rankings.length > 0 && (
                <TabsTrigger value="rankings" icon={<RankingsIcon />}>
                  Rankings
                </TabsTrigger>
              )}
              {eventData.matches.length > 0 && (
                <TabsTrigger
                  value="matches"
                  icon={<MatchesIcon />}
                  badgeCount={eventData.matches.length}
                >
                  Matches
                </TabsTrigger>
              )}
              {eventData.teams.length > 0 && (
                <TabsTrigger value="teams" icon={<TeamsIcon />} badgeCount={eventData.teams.length}>
                  Teams
                </TabsTrigger>
              )}
              {eventData.alliances.length > 0 && (
                <TabsTrigger
                  value="alliances"
                  icon={<AlliancesIcon />}
                  badgeCount={eventData.alliances.length}
                >
                  Alliances
                </TabsTrigger>
              )}
              {eventData.awards.length > 0 && (
                <TabsTrigger value="awards" icon={<AwardsIcon />}>
                  Awards
                </TabsTrigger>
              )}
              {eventData.insights.filter(insights => insights).length > 0 && (
                <TabsTrigger value="insights" icon={<InsightsIcon />}>
                  Insights
                </TabsTrigger>
              )}
              {isEventAdmin && (
                <TabsTrigger value="admin" icon={<AdminIcon />}>
                  Admin
                </TabsTrigger>
              )}
            </TabsList>
          )}

          <Card sx={{ mt: 1 }}>
            {!firstTab && (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  color: 'text.secondary'
                }}
              >
                {t('no_data.event_long')}
              </Box>
            )}
            <Tabs.Content value="rankings">
              <RankingTab event={eventData} />
            </Tabs.Content>
            <Tabs.Content value="matches">
              <MatchesTab event={eventData} />
            </Tabs.Content>
            <Tabs.Content value="teams">
              <TeamsTab teams={eventData.teams} />
            </Tabs.Content>
            <Tabs.Content value="alliances">
              <AlliancesTab event={eventData} />
            </Tabs.Content>
            <Tabs.Content value="awards">
              <AwardsTab awards={eventData.awards} />
            </Tabs.Content>
            <Tabs.Content value="insights">
              <InsightsTab event={eventData} />
            </Tabs.Content>
            <Tabs.Content value="admin">
              <AdminTab event={eventData} streams={streams} />
            </Tabs.Content>
          </Card>
        </Tabs.Root>

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
