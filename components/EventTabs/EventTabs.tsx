import * as React from 'react';
import { Tabs, Tab } from '@mui/material';
import { RankingTab, MatchesTab, TeamsTab, AlliancesTab, AwardsTab, InsightsTab } from './index';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Event } from '@the-orange-alliance/api/lib/cjs/models';
import { useTranslate } from '../../i18n/i18n';
import { useRouter } from 'next/router';

interface IProps {
  event: Event;
}

interface ITabProps {
  tabRoute: string;
  translationKey: string;
  component: () => React.ReactElement;
}

const EventTabs = ({ event }: IProps) => {
  const [tabs, setTabs] = useState<ITabProps[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(-1);
  const t = useTranslate();
  const router = useRouter();
  const tab_key = typeof router.query.tab_key === 'string' ? router.query.tab_key : 'ranking';

  useEffect(() => {
    const newTabs = getTabs();
    const tabByPath = findTabByPath(newTabs, tab_key);
    if (tabByPath > -1) {
      setSelectedTab(tabByPath);
    } else {
      tabHandler(null, 0, newTabs);
    }
    setTabs(newTabs);
    // Register Router change listener
    router.events.off('routeChangeComplete', () => {});
    router.events.on('routeChangeComplete', url => {
      const parts = url.split('/');
      if (parts[1] !== 'events' || parts[2] !== event.eventKey) {
        router.events.off('routeChangeComplete', () => {});
        return;
      }
      const tab_key = parts[parts.length - 1];
      const index = newTabs.findIndex(t => t.tabRoute === tab_key);
      if (index > -1 && index !== selectedTab) {
        setSelectedTab(index);
      } else if (index < 0 && tab_key !== newTabs[0].tabRoute) {
        tabHandler(null, 0, newTabs);
      }
    });
  }, []);

  function findTabByPath(newTabs: ITabProps[], path: string): number {
    return newTabs.map(e => e.tabRoute).indexOf(path);
  }

  function getTabs(): ITabProps[] {
    const newTabs: ITabProps[] = [];

    if (event.rankings.length > 0) {
      newTabs.push({
        tabRoute: 'rankings',
        translationKey: 'pages.event.subpages.rankings',
        component: () => <RankingTab key={'tab-rankings'} event={event} />
      });
    }

    if (event.matches.length > 0) {
      newTabs.push({
        tabRoute: 'matches',
        translationKey: 'pages.event.subpages.matches',
        component: () => <MatchesTab key={'tab-matches'} event={event} />
      });
    }

    if (event.teams.length > 0) {
      newTabs.push({
        tabRoute: 'teams',
        translationKey: 'pages.event.subpages.teams',
        component: () => <TeamsTab key={'tab-teams'} event={event} />
      });
    }

    if (event.alliances.length > 0) {
      newTabs.push({
        tabRoute: 'alliances',
        translationKey: 'pages.event.subpages.alliances',
        component: () => <AlliancesTab key={'tab-alliances'} event={event} />
      });
    }

    if (event.awards.length) {
      newTabs.push({
        tabRoute: 'awards',
        translationKey: 'pages.event.subpages.awards',
        component: () => <AwardsTab key={'tab-awards'} event={event} />
      });
    }

    if (event.insights.length > 0 && (event.insights[0] || event.insights[1])) {
      newTabs.push({
        tabRoute: 'insights',
        translationKey: 'pages.event.subpages.insights',
        component: () => <InsightsTab key={'tab-insights'} event={event} />
      });
    }

    return newTabs;
  }

  function tabHandler(e: SyntheticEvent | null, value: number, newTabs?: ITabProps[]) {
    if (!newTabs) newTabs = tabs;
    router.push(
      {
        pathname: `/events/${event.eventKey}/${newTabs[value].tabRoute}`
      },
      undefined,
      { shallow: true }
    );
  }

  function getSelectedTab(): React.ReactElement {
    return tabs[selectedTab].component();
  }

  return (
    <>
      {tabs && tabs.length > 0 && (
        <div className="event-tabs">
          <Tabs
            onChange={tabHandler}
            value={selectedTab}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            scrollButtons="auto"
          >
            {tabs.map((tb: ITabProps, i: number) => {
              return <Tab value={i} key={tb.tabRoute} label={t(tb.translationKey + '.title')} />;
            })}
          </Tabs>
          {selectedTab > -1 && getSelectedTab()}
        </div>
      )}
      {!tabs ||
        (tabs && tabs.length < 1 && (
          <div className={'event-tabs text-center'}>{t('no_data.event_long')}</div>
        ))}
    </>
  );
};

export default EventTabs;
