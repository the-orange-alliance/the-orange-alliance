import { useEffect, useRef, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import { Box, Card, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useTranslate } from '@/i18n/i18n';
import {
  getInsightsData,
  IRawInsightsProps,
  parseInsightsProps
} from '@/lib/page-helpers/insightsHelper';
import InsightsTab from '@/components/pages/event/insights/InsightsTab';
import FiltersCard from '@/components/ui/filters-card';
import { useAppContext } from '@/lib/toa-context';
import SEO from '@/components/seo';
import { getSeasonString } from '@/lib/utils/common';

const InsightsPage: NextPage<IRawInsightsProps> = props => {
  const router = useRouter();
  const t = useTranslate();
  const { regions, seasons } = useAppContext();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const currentTabRef = useRef<number>(0);
  const { elimsMultiTeam, combo, qualsMultiTeam, qualsSingleTeam, seasonKey } =
    parseInsightsProps(props);
  const tabs = ['quals', 'elims', 'stquals', 'combined'];

  const selectedSeason = seasons.find(s => s.seasonKey === seasonKey)!;

  useEffect(() => {
    const tabByPath = tabs.findIndex(t => t === router.query.tab_key);
    if (tabByPath > -1) {
      updateTab(tabByPath);
    } else {
      tabHandler(null, 0);
    }

    // Register Router change listener
    router.events.off('routeChangeComplete', () => {});
    router.events.on('routeChangeComplete', url => {
      const parts = url.split('/');
      // If user moved to a differnet page
      if (parts[1] !== 'insights') {
        router.events.off('routeChangeComplete', () => {});
        return;
      }

      let tab_key = parts[parts.length - 1];
      // Check for query params
      if (tab_key.indexOf('?') > 0) {
        tab_key = tab_key.split('?')[0];
      }

      const index = tabs.findIndex(t => t === tab_key);

      // We must use a ref here since this is a callback, we'll have a stale state
      if (index > -1 && index !== currentTabRef.current) {
        updateTab(index);
      } else if (index < 0 && tab_key !== tabs[0]) {
        tabHandler(null, 0);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateTab = (tab: number) => {
    setCurrentTab(tab);
    currentTabRef.current = tab;
  };

  const tabHandler = (e: any, value: number) => {
    const query = { ...router.query };
    delete query.tab_key;
    router
      .push(
        {
          pathname: `/insights/${tabs[value]}`,
          query: query
        },
        undefined,
        { shallow: true }
      )
      .then(() => {
        updateTab(value);
      });
  };

  return (
    <>
      <SEO title="Insights" url="/insights" />

      <Typography variant="h1" sx={{ my: 4, mx: 2 }}>
        {getSeasonString(selectedSeason)} {t('drawer.insights')}
      </Typography>

      <FiltersCard regions={regions} seasons={seasons} route="/insights" forceReload={true} />

      <Card sx={{ margin: 2, marginTop: 5 }}>
        <Tabs value={currentTab} onChange={tabHandler} variant="fullWidth">
          <Tab label="Qualification" value={0} />
          <Tab label="Elimination" value={1} />

          {(seasonKey === '2021' || seasonKey === '2122' || seasonKey === '2223') && [
            <Tab key="stq" label="Single-Team Qualification" value={2} />,
            <Tab key="combo" label="Combined Qualification" value={3} />
          ]}
        </Tabs>

        <Box sx={{ marginTop: 2, pb: 6 }}>
          {currentTab === 0 && <InsightsTab insights={qualsMultiTeam} seasonKey={seasonKey} />}
          {currentTab === 1 && <InsightsTab insights={elimsMultiTeam} seasonKey={seasonKey} />}
          {currentTab === 2 && <InsightsTab insights={qualsSingleTeam} seasonKey={seasonKey} />}
          {currentTab === 3 && <InsightsTab insights={combo} seasonKey={seasonKey} />}
        </Box>
      </Card>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const possibleTabs = ['quals', 'elims', 'stquals', 'combined'];
  if (!possibleTabs.includes(context.params?.tab_key + '')) {
    return {
      redirect: {
        destination: '/insights/quals',
        permanent: false
      }
    };
  }

  return { props: await getInsightsData(context.query.season_key, context.query.region_key) };
};

export default InsightsPage;
