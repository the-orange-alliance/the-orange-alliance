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
  const t = useTranslate();
  const { seasons } = useAppContext();
  const [currentTab, setCurrentTab] = useState<number>(0);
  const { elimsMultiTeam, combo, qualsMultiTeam, qualsSingleTeam, seasonKey } =
    parseInsightsProps(props);

  const selectedSeason = seasons.find(s => s.seasonKey === seasonKey)!;

  return (
    <>
      <SEO title="Insights" url="/insights" />

      <Typography variant="h1" sx={{ my: 4, mx: 2 }}>
        {getSeasonString(selectedSeason)} {t('drawer.insights')}
      </Typography>

      <FiltersCard forceReload={true} />

      <Card sx={{ margin: 2, marginTop: 5 }}>
        <Tabs
          variant="fullWidth"
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
        >
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
  const insightsData = await getInsightsData(context.query.season, context.query.region);
  return { props: insightsData };
};

export default InsightsPage;
