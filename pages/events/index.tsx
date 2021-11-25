import { useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
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
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Region, Season, Week, Event } from '@the-orange-alliance/api/lib/cjs/models';
import SimpleEventPaper from '../../components/SimpleEventPaper';
import {
  getEventsData,
  IRawEventsProps,
  parseEventsProps
} from '../../lib/PageHelpers/eventsHelper';
import { useTranslate } from '../../i18n/i18n';
import { useRouter } from 'next/router';
import { CURRENT_SEASON } from '../../constants';
import { getSeasonString } from '../../util/common-utils';

const useStyles = makeStyles((theme: Theme) => ({
  filterSelect: {
    width: '30px'
  }
}));

interface AutoComplete<T> {
  label: string;
  parent: T;
}

const EventsPage: NextPage<IRawEventsProps> = props => {
  const classes = useStyles();
  const router = useRouter();
  const t = useTranslate();
  const { events, regions, seasons, weeks } = parseEventsProps(props);

  const [localRegions, setLocalRegions] = useState<AutoComplete<Region>[]>([]);
  const [localSeasons, setLocalSeasons] = useState<AutoComplete<Season>[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<AutoComplete<Region>>();
  const [selectedSeason, setSelectedSeason] = useState<AutoComplete<Season>>();
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    // Set current week
    if (weeks.length > 0) setSelectedTab(weeks[0].weekKey);

    // Set Region and create region dropdown options
    let tempRegion = { label: regions[0].description, parent: regions[0] };
    setLocalRegions(
      regions.map((r: Region) => {
        const temp = { label: getRegionString(r), parent: r };
        if (r.regionKey === router.query.region_key) tempRegion = temp;
        return temp;
      })
    );
    setSelectedRegion(tempRegion);

    // Set Season and create season dropdown options
    let tempSeason = { label: getSeasonString(seasons[0]), parent: seasons[0] };
    setLocalSeasons(
      seasons.map((s: Season) => {
        const temp = { label: getSeasonString(s), parent: s };
        if (s.seasonKey === router.query.season_key) tempSeason = temp;
        return temp;
      })
    );
    setSelectedSeason(tempSeason);
  }, []);

  useEffect(() => {
    // Select first week if the currently selected week doesn't exist
    if (weeks.length > 0 && !weeks.find(w => w.weekKey === selectedTab))
      setSelectedTab(weeks[0].weekKey);
  }, [weeks]);

  function getRegionString(region: Region) {
    if (region.regionKey === 'all') return region.description;
    return `${region.regionKey.toUpperCase()} - ${region.description}`;
  }

  function onSelectSeason(event: any, val: AutoComplete<Season> | null) {
    if (!val) return;
    if (selectedSeason && val.parent.seasonKey === selectedSeason.parent.seasonKey) return;
    pushNewFilter(val.parent, selectedRegion?.parent);
  }

  function onSelectRegion(event: any, val: AutoComplete<Region> | null) {
    if (!val) return;
    if (selectedRegion && val.parent.regionKey === selectedRegion.parent.regionKey) return;
    pushNewFilter(selectedSeason?.parent, val.parent);
  }

  function pushNewFilter(season?: Season, region?: Region) {
    setFetching(true);
    const query = {} as any;
    if (season && season.seasonKey !== CURRENT_SEASON) query.season_key = season.seasonKey;
    if (region && region.regionKey !== 'all') query.region_key = region.regionKey;
    router.push({ pathname: '/events', query: query }).then(() => {
      setFetching(false);
      setSelectedSeason(
        query.season_key
          ? localSeasons.find(s => s.parent.seasonKey === query.season_key)
          : localSeasons[0]
      );
      setSelectedRegion(
        query.region_key
          ? localRegions.find(r => r.parent.regionKey === query.region_key)
          : localRegions[0]
      );
    });
  }

  function selectTab(e: SyntheticEvent, val: string) {
    setSelectedTab(val);
  }

  function clearFilters() {
    pushNewFilter();
  }

  function getWeekName(week: string) {
    switch (week) {
      case 'CMP':
        return 'FIRST Championship';
      case 'CMPHOU':
        return 'FIRST Championship - Houston';
      case 'CMPSTL':
        return 'FIRST Championship - St. Louis';
      case 'CMPDET':
        return 'FIRST Championship - Detroit';
      case 'ESR':
        return 'East Super Regional Championship';
      case 'NSR':
        return 'North Super Regional Championship';
      case 'SSR':
        return 'South Super Regional Championship';
      case 'WSR':
        return 'West Super Regional Championship';
      case 'SPR':
        return 'Super Regionals';
      case 'FOC':
        return 'Festival of Champions';
      default:
        if (week.match('-?\\d+(\\.\\d+)?')) {
          // match a number with optional '-' and decimal.
          return 'Week ' + week;
        } else {
          return week;
        }
    }
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {t('general.events')}
      </Typography>

      <Card>
        {fetching && <LinearProgress />}
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('pages.events.filter')}
          </Typography>
          <Divider />
          <Grid container>
            <Grid item xs={4} p={2}>
              <Autocomplete
                key={selectedSeason?.label}
                disablePortal
                id="seasons-filter"
                options={localSeasons}
                value={selectedSeason}
                isOptionEqualToValue={(a, b) => a.parent.seasonKey === b.parent.seasonKey}
                defaultValue={selectedSeason}
                onChange={onSelectSeason}
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
                key={selectedRegion?.label}
                disablePortal
                id="regions-filter"
                options={localRegions}
                value={selectedRegion}
                isOptionEqualToValue={(a, b) => a.parent.regionKey === b.parent.regionKey}
                defaultValue={selectedRegion}
                onChange={onSelectRegion}
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
        {!fetching && events.length > 0 && (
          <CardContent>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={selectedTab} onChange={selectTab} variant={'fullWidth'}>
                  {weeks.map((week: Week) => (
                    <Tab
                      key={week.weekKey}
                      label={getWeekName(week.weekKey)}
                      value={week.weekKey}
                    />
                  ))}
                </Tabs>
              </Box>
              {events.map(event => {
                if (event.weekKey === selectedTab) {
                  return <SimpleEventPaper key={event.eventKey} event={event} />;
                }
              })}
            </Box>
          </CardContent>
        )}
      </Card>

      {/* No Event Data */}
      {!fetching && events.length === 0 && (
        <CardContent className={'text-center'}>
          <img src="/imgs/empty-icon.svg" height="110" className="mb-3" />
          <Typography variant={'h6'}>{t('no_data.events_filter')}</Typography>
          <Typography variant={'body1'}>{t('no_data.events_filter_long')}</Typography>
        </CardContent>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  return { props: await getEventsData(context.query.season_key, context.query.region_key) };
};

export default EventsPage;
