import { useEffect, SyntheticEvent, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { Box, Card, CardContent, Tab, Tabs, Typography, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Week } from '@the-orange-alliance/api/lib/cjs/models';
import SimpleEventPaper from '../../components/SimpleEventPaper';
import FilterCard from '../../components/FilterCard';
import {
  getEventsData,
  IRawEventsProps,
  parseEventsProps
} from '../../lib/PageHelpers/eventsHelper';
import { useTranslate } from '../../i18n/i18n';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme: Theme) => ({
  filterSelect: {
    width: '30px'
  }
}));

const EventsPage: NextPage<IRawEventsProps> = props => {
  const classes = useStyles();
  const router = useRouter();
  const t = useTranslate();
  const { events, regions, seasons, weeks } = parseEventsProps(props);

  const [selectedTab, setSelectedTab] = useState<string>('');
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    // Set current week
    if (weeks.length > 0) setSelectedTab(weeks[0].weekKey);
  }, []);

  useEffect(() => {
    // Select first week if the currently selected week doesn't exist
    if (weeks.length > 0 && !weeks.find(w => w.weekKey === selectedTab))
      setSelectedTab(weeks[0].weekKey);
  }, [weeks]);

  function selectTab(e: SyntheticEvent, val: string) {
    setSelectedTab(val);
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

      <FilterCard regions={regions} seasons={seasons} route={'/events'} />

      <Card className={'mt-5'}>
        <Tabs value={selectedTab} onChange={selectTab} variant={'scrollable'}>
          {weeks.map((week: Week) => (
            <Tab key={week.weekKey} label={getWeekName(week.weekKey)} value={week.weekKey} />
          ))}
        </Tabs>
        {!fetching &&
          events.length > 0 &&
          events.map(event => {
            if (event.weekKey === selectedTab) {
              return <SimpleEventPaper key={event.eventKey} event={event} />;
            }
          })}
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
