import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Tabs, Tab, Box } from '@mui/material';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import { RankingTab, MatchesTab, TeamsTab, AlliancesTab, AwardsTab, InsightsTab } from './index';
import { useTranslate } from '../../i18n/i18n';

interface IProps {
  event: Event;
}

interface ITabProps {
  id: string;
  component: React.ReactElement;
}

const EventTabs = ({ event }: IProps) => {
  const t = useTranslate();
  const router = useRouter();
  const tabs = useMemo((): ITabProps[] => {
    const tabs: ITabProps[] = [];
    if (event.rankings.length > 0) {
      tabs.push({
        id: 'rankings',
        component: <RankingTab event={event} />
      });
    }
    if (event.matches.length > 0) {
      tabs.push({
        id: 'matches',
        component: <MatchesTab event={event} />
      });
    }
    if (event.teams.length > 0) {
      tabs.push({
        id: 'teams',
        component: <TeamsTab event={event} />
      });
    }
    if (event.alliances.length > 0) {
      tabs.push({
        id: 'alliances',
        component: <AlliancesTab event={event} />
      });
    }
    if (event.awards.length) {
      tabs.push({
        id: 'awards',
        component: <AwardsTab event={event} />
      });
    }
    if (event.insights.length > 0 && (event.insights[0] || event.insights[1])) {
      tabs.push({
        id: 'insights',
        component: <InsightsTab event={event} />
      });
    }
    return tabs;
  }, [event]);
  const [selectedTabId, setSelectedTabId] = useState<string>(tabs[0]?.id);

  const selectedTab = useMemo(
    () => tabs.find(tab => tab.id === selectedTabId),
    [selectedTabId, tabs]
  );

  const handleTabChange = useCallback(
    (e: SyntheticEvent | null, route: string) => {
      router.push({ pathname: `/events/${event.eventKey}/${route}` }, undefined, {
        shallow: true
      });
    },
    [event.eventKey, router]
  );

  useEffect(() => {
    const route = String(router.query.tab_key);
    const tab = tabs.find(tab => tab.id === route);
    if (tab) {
      setSelectedTabId(tab.id);
    } else if (tabs[0]) {
      const defaultTab = tabs[0];
      setSelectedTabId(defaultTab.id);
      handleTabChange(null, defaultTab.id);
    }
  }, [handleTabChange, router.query, tabs]);

  return (
    <>
      {tabs.length > 0 ? (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedTabId}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
              scrollButtons="auto"
            >
              {tabs.map((tab: ITabProps, i: number) => {
                return (
                  <Tab
                    key={tab.id}
                    value={tab.id}
                    label={t(`pages.event.subpages.${tab.id}.title`)}
                  />
                );
              })}
            </Tabs>
          </Box>
          {selectedTab?.component}
        </>
      ) : (
        <div className={'event-tabs text-center'}>{t('no_data.event_long')}</div>
      )}
    </>
  );
};

export default EventTabs;
