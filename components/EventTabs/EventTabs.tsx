import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Tabs, Tab, Box } from '@mui/material';
import { Event, EventLiveStream } from '@the-orange-alliance/api/lib/cjs/models';
import {
  RankingTab,
  MatchesTab,
  TeamsTab,
  AlliancesTab,
  AwardsTab,
  InsightsTab,
  AdminTab
} from './index';
import { useTranslate } from '../../i18n/i18n';
import { useAppContext } from '../../lib/toa-context';

interface IProps {
  event: Event;
  streams: EventLiveStream[];
}

interface ITabProps {
  id: string;
  component: React.ReactElement;
  count?: number;
}

const EventTabs = ({ event, streams }: IProps) => {
  const t = useTranslate();
  const router = useRouter();
  const { user } = useAppContext();
  const [localStreams, setLocalStreams] = useState<EventLiveStream[]>(streams);

  // If add is false, it's a delete
  const handleStreamChange = (stream: EventLiveStream, add: boolean) => {
    if (add) {
      setLocalStreams([...localStreams, stream]);
    } else {
      setLocalStreams([...localStreams.filter(s => s.streamKey !== stream.streamKey)]);
    }
  };

  const tabs = useMemo((): ITabProps[] => {
    const tabs: ITabProps[] = [];
    if (event.rankings.length > 0) {
      tabs.push({
        id: 'rankings',
        component: <RankingTab event={event} />,
        count: event.rankings.length
      });
    }
    if (event.matches.length > 0) {
      tabs.push({
        id: 'matches',
        component: <MatchesTab event={event} />,
        count: event.matches.length
      });
    }
    if (event.teams.length > 0) {
      tabs.push({
        id: 'teams',
        component: <TeamsTab event={event} />,
        count: event.teams.length
      });
    }
    if (event.alliances.length > 0) {
      tabs.push({
        id: 'alliances',
        component: <AlliancesTab event={event} />,
        count: event.alliances.length
      });
    }
    if (event.awards.length) {
      tabs.push({
        id: 'awards',
        component: <AwardsTab awards={event.awards} />,
        count: event.awards.length
      });
    }
    if (event.insights.length > 0 && (event.insights[0] || event.insights[1])) {
      tabs.push({
        id: 'insights',
        component: <InsightsTab event={event} />
      });
    }
    if (
      user &&
      (user.level === 6 ||
        user.adminRegions.includes(event.regionKey) ||
        user.adminEvents.includes(event.eventKey) ||
        (event.leagueKey && user.adminLeagues.includes(event.leagueKey)))
    ) {
      tabs.push({
        id: 'admin',
        component: (
          <AdminTab
            event={event}
            user={user}
            streams={localStreams}
            handleStreamChange={handleStreamChange}
          />
        )
      });
    }
    return tabs;
  }, [event, user]);
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
                    sx={{
                      display: 'inline !important',
                      py: 2.5
                    }}
                    label={
                      <>
                        <Box sx={{ display: 'inline-block' }}>
                          {t(`pages.event.subpages.${tab.id}.title`)}
                        </Box>
                        {typeof tab.count === 'number' && (
                          <Box
                            sx={{
                              mx: 0.5,
                              color: 'text.primary',
                              bgcolor: 'primary.main',
                              display: 'inline-block',
                              padding: '0.25em 0.4em',
                              fontSize: '75%',
                              fontWeight: '700',
                              lineHeight: '1',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              verticalAlign: 'baseline',
                              pr: '0.6em',
                              pl: '0.6em',
                              borderRadius: '10rem'
                            }}
                            component={'span'}
                          >
                            {tab.count}
                          </Box>
                        )}
                      </>
                    }
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
