import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/legacy/image';
import { Badge, Box, Card, CardContent, Tab, Tabs, Typography } from '@mui/material';
import { Region, Season, Week } from '@the-orange-alliance/api/lib/cjs/models';
import EventItem from '@/components/ui/event-item';
import FiltersCard from '@/components/ui/filters-card';
import {
  fetchEventsData,
  IRawEventsProps,
  organizeEventsByWeek,
  parseEventsProps
} from '@/lib/page-helpers/events-helper';
import { useTranslate } from '@/i18n/i18n';
import { CURRENT_SEASON } from '@/constants';
import { getSeasonYear, getWeekName } from '@/lib/utils/common';
import TOAProvider from '@/providers/toa-provider';
import { useAppContext } from '@/lib/toa-context';
import SEO from '@/components/seo';

const EventsPage: NextPage<IRawEventsProps> = props => {
  const { regions, seasons } = useAppContext();
  const { events: initialEvents } = parseEventsProps(props);
  const t = useTranslate();
  const [selectedRegion, setSelectedRegion] = useState<Region>(() => regions[0]);
  const [selectedSeason, setSelectedSeason] = useState<Season>(() => seasons[0]);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [seasonEvents, setSeasonEvents] = useState(initialEvents);
  const [filteredEvents, setFilteredEvents] = useState(seasonEvents);
  const [weeks, setWeeks] = useState(organizeEventsByWeek(filteredEvents));
  const [selectedWeek, setSelectedWeek] = useState<string>(weeks[0]?.weekKey);

  const handleSeasonSelect = useCallback(
    (season: Season) => {
      setSelectedSeason(season);
      if (season.seasonKey === CURRENT_SEASON) {
        setSeasonEvents(initialEvents);
      } else {
        setFetching(true);
        TOAProvider.getAPI()
          .getEvents({ season_key: season.seasonKey, includeTeamCount: true })
          .then(setSeasonEvents)
          .finally(() => setFetching(false));
      }
    },
    [initialEvents]
  );

  const handleRegionSelect = useCallback((region: Region) => {
    setSelectedRegion(region);
  }, []);

  const selectTab = useCallback((e: SyntheticEvent, val: string) => {
    setSelectedWeek(val);
  }, []);

  useEffect(() => {
    const filteredEvents =
      selectedRegion.regionKey === 'all'
        ? seasonEvents
        : seasonEvents.filter(event => event.regionKey === selectedRegion.regionKey);
    setFilteredEvents(filteredEvents);
    const weeks = organizeEventsByWeek(filteredEvents);
    setWeeks(weeks);
    if (!weeks.some(w => w.weekKey === selectedWeek)) {
      setSelectedWeek(weeks[0]?.weekKey);
    }
  }, [seasonEvents, selectedRegion.regionKey, selectedWeek]);

  const getEventsByWeek = (week: Week) => {
    return filteredEvents.filter(event => event.weekKey === week.weekKey);
  };

  return (
    <>
      <SEO title="Events" description="List of FIRST Tech Challenge events." url="/events" />

      <Typography variant="h1" sx={{ my: 4, mx: 2 }}>
        {getSeasonYear(selectedSeason)} <em>FIRST</em> Tech Challenge Events
      </Typography>

      <FiltersCard
        onSeasonChange={handleSeasonSelect}
        onRegionChange={handleRegionSelect}
        fetching={isFetching}
      />

      {filteredEvents.length > 0 && (
        <Card sx={{ marginTop: 5, marginLeft: 2, marginRight: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedWeek}
              onChange={selectTab}
              variant="scrollable"
              scrollButtons="auto"
            >
              {weeks.map((week: Week) => (
                <Tab
                  key={week.weekKey}
                  label={<Box sx={{ mt: 1 }}>{getWeekName(week.weekKey)}</Box>}
                  value={week.weekKey}
                  iconPosition="top"
                  icon={
                    <Badge
                      badgeContent={getEventsByWeek(week).length}
                      max={9999}
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                  }
                  sx={{ px: 2, maxWidth: '14em' }}
                />
              ))}
            </Tabs>
          </Box>
          {!isFetching && filteredEvents.length > 0 && (
            <CardContent>
              <Box sx={{ width: '100%' }}>
                {filteredEvents.map(event => {
                  if (event.weekKey === selectedWeek) {
                    return <EventItem key={event.eventKey} event={event} />;
                  }
                })}
              </Box>
            </CardContent>
          )}
        </Card>
      )}

      {/* No Event Data */}
      {!isFetching && filteredEvents.length === 0 && (
        <CardContent sx={{ textAlign: 'center' }}>
          <Image src="/imgs/empty-icon.svg" height={110} width={110} alt="Empty Illustration" />
          <Typography variant="h6">{t('no_data.events_filter')}</Typography>
          <Typography variant="body1">{t('no_data.events_filter_long')}</Typography>
        </CardContent>
      )}
    </>
  );
};

export default EventsPage;

export async function getStaticProps() {
  return {
    props: await fetchEventsData(),
    // Re-generate the events page at most once per 15 minute
    revalidate: 15 * 60
  };
}
