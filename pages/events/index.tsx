import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Region, Season, Week } from '@the-orange-alliance/api/lib/cjs/models';
import SimpleEventPaper from '../../components/SimpleEventPaper';
import {
  getEventsData,
  IRawEventsProps,
  organizeEventsByWeek,
  useEventsProps
} from '../../lib/PageHelpers/eventsHelper';
import { useTranslate } from '../../i18n/i18n';
import { CURRENT_SEASON } from '../../constants';
import { getRegionString, getSeasonString, getWeekName } from '../../util/common-utils';
import TOAProvider from '../../providers/TOAProvider';

const EventsPage: NextPage<IRawEventsProps> = props => {
  const t = useTranslate();
  const { events: initialEvents, regions, seasons } = useEventsProps(props);
  const [selectedSeason, setSelectedSeason] = useState<Season>(
    () => seasons.find(s => s.seasonKey === CURRENT_SEASON) || seasons[0]
  );
  const [selectedRegion, setSelectedRegion] = useState<Region>(() => regions[0]);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [seasonEvents, setSeasonEvents] = useState(initialEvents);
  const [filteredEvents, setFilteredEvents] = useState(seasonEvents);
  const [weeks, setWeeks] = useState(organizeEventsByWeek(filteredEvents));
  const [selectedWeek, setSelectedWeek] = useState<string>(weeks[0]?.weekKey);

  const handleSeasonSelect = useCallback(
    (e: any, season: Season | null) => {
      if (!season) return;
      setSelectedSeason(season);
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

  const handleRegionSelect = useCallback((e: any, region: Region | null) => {
    if (!region) return;
    setSelectedRegion(region);
  }, []);

  const selectTab = useCallback((e: SyntheticEvent, val: string) => {
    setSelectedWeek(val);
  }, []);

  const clearFilters = useCallback(() => {
    const season = seasons.find(s => s.seasonKey === CURRENT_SEASON) || seasons[0];
    setSelectedRegion(regions[0]);
    handleSeasonSelect(null, season);
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

  console.log('r');
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {t('general.events')}
      </Typography>

      <Card>
        {isFetching && <LinearProgress />}
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('pages.events.filter')}
          </Typography>
          <Divider />
          <Grid container>
            <Grid item xs={4} p={2}>
              <Autocomplete
                disablePortal
                options={seasons}
                value={selectedSeason}
                onChange={handleSeasonSelect}
                isOptionEqualToValue={(a, b) => a.seasonKey === b.seasonKey}
                getOptionLabel={(season: Season) => getSeasonString(season)}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant={'standard'}
                    label={t('pages.events.filter_season')}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} p={2}>
              <Autocomplete
                disablePortal
                options={regions}
                value={selectedRegion}
                onChange={handleRegionSelect}
                isOptionEqualToValue={(a, b) => a.regionKey === b.regionKey}
                getOptionLabel={(region: Region) => getRegionString(region)}
                renderInput={params => (
                  <TextField
                    {...params}
                    variant={'standard'}
                    label={t('pages.events.filter_region')}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Divider />
          <Button fullWidth onClick={clearFilters}>
            {t('pages.events.clear_filter')}
          </Button>
        </CardContent>
      </Card>

      <Card className={'mt-5'}>
        {!isFetching && filteredEvents.length > 0 && (
          <CardContent>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={selectedWeek} onChange={selectTab} variant={'fullWidth'}>
                  {weeks.map((week: Week) => (
                    <Tab
                      key={week.weekKey}
                      value={week.weekKey}
                      label={getWeekName(week.weekKey)}
                    />
                  ))}
                </Tabs>
              </Box>
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
        <CardContent>
          <Image src="/imgs/empty-icon.svg" height={110} width={110} alt="Empty Illustration" />
          <Typography variant="h6">{t('no_data.events_filter')}</Typography>
          <Typography variant="body1">{t('no_data.events_filter_long')}</Typography>
        </CardContent>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return { props: await getEventsData() };
};

export default EventsPage;
