import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { Box, Card, CardContent, Tab, Tabs, Typography } from '@mui/material';
import { Region, Season, Week } from '@the-orange-alliance/api/lib/cjs/models';
import SimpleEventPaper from '../../components/SimpleEventPaper';
import FilterCard from '../../components/FilterCard';
import { organizeEventsByWeek } from '../../lib/page-helpers/events-helper';
import { useTranslate } from '../../i18n/i18n';
import { CURRENT_SEASON } from '../../constants';
import { getWeekName } from '../../lib/utils/common';
import TOAProvider from '../../providers/TOAProvider';
import { useAppContext } from '../_app';

const EventsPage: NextPage = () => {
  const { events: initialEvents, regions, seasons } = useAppContext();
  const t = useTranslate();
  const [selectedRegion, setSelectedRegion] = useState<Region>(() => regions[0]);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [seasonEvents, setSeasonEvents] = useState(initialEvents);
  const [filteredEvents, setFilteredEvents] = useState(seasonEvents);
  const [weeks, setWeeks] = useState(organizeEventsByWeek(filteredEvents));
  const [selectedWeek, setSelectedWeek] = useState<string>(weeks[0]?.weekKey);

  const handleSeasonSelect = useCallback(
    (season: Season) => {
      if (!season) return;
      if (season.seasonKey === CURRENT_SEASON) {
        setSeasonEvents(initialEvents);
      } else {
        setFetching(true);
        TOAProvider.getAPI()
          .getEvents({ season_key: season.seasonKey })
          .then(setSeasonEvents)
          .finally(() => setFetching(false));
      }
    },
    [initialEvents]
  );

  const handleRegionSelect = useCallback((region: Region) => {
    if (!region) return;
    setSelectedRegion(region);
  }, []);

  const selectTab = useCallback((e: SyntheticEvent, val: string) => {
    setSelectedWeek(val);
  }, []);

  const clearFilters = useCallback(() => {
    const season = seasons.find(s => s.seasonKey === CURRENT_SEASON) || seasons[0];
    setSelectedRegion(regions[0]);
    handleSeasonSelect(season);
  }, [handleSeasonSelect, regions, seasons]);

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

  return (
    <div>
      <Typography sx={{ margin: 2 }} variant="h4">
        {t('general.events')}
      </Typography>

      <FilterCard
        regions={regions}
        seasons={seasons}
        route={'/events'}
        forceReload={false}
        onRegionComplete={handleRegionSelect}
        onSeasonComplete={handleSeasonSelect}
        onClearFiltersComplete={clearFilters}
        fetchingOverride={isFetching}
      />

      <Card sx={{ marginTop: 5, marginLeft: 2, marginRight: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedWeek} onChange={selectTab} variant={'fullWidth'}>
            {weeks.map((week: Week) => (
              <Tab key={week.weekKey} value={week.weekKey} label={getWeekName(week.weekKey)} />
            ))}
          </Tabs>
        </Box>
        {!isFetching && filteredEvents.length > 0 && (
          <CardContent>
            <Box sx={{ width: '100%' }}>
              {filteredEvents.map(event => {
                if (event.weekKey === selectedWeek) {
                  return <SimpleEventPaper key={event.eventKey} event={event} />;
                }
              })}
            </Box>
          </CardContent>
        )}
      </Card>

      {/* No Event Data */}
      {!isFetching && filteredEvents.length === 0 && (
        <CardContent sx={{ textAlign: 'center' }}>
          <Image src="/imgs/empty-icon.svg" height={110} width={110} alt="Empty Illustration" />
          <Typography variant="h6">{t('no_data.events_filter')}</Typography>
          <Typography variant="body1">{t('no_data.events_filter_long')}</Typography>
        </CardContent>
      )}
    </div>
  );
};

export default EventsPage;
