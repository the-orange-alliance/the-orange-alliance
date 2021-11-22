import * as React from "react";
import { Tabs, Tab } from "@mui/material";
import { RankingTab, MatchesTab, TeamsTab, AlliancesTab, AwardsTab, InsightsTab } from "./index";
import { useTranslation } from "react-i18next";
import { SyntheticEvent, useEffect, useState } from "react";
import { Event } from "@the-orange-alliance/api/lib/esm/models";
import { useHistory, useParams } from "react-router-dom";

interface IProps {
  event: Event;
  currentTab: string;
}

interface ITabProps {
  tabRoute: string;
  translationKey: string;
  component: () => React.ReactElement;
}

const EventTabs = ({ event }: IProps) => {
  const { t } = useTranslation();
  const { eventCode, tab } = useParams<{ eventCode: string; tab: string }>();
  const history = useHistory();
  const [tabs, setTabs] = useState<ITabProps[]>([]);
  const [selectedTab, setSelectedTab] = useState<number>(-1);

  useEffect(() => {
    const newTabs = getTabs();
    setSelectedTab(findTabByPath(newTabs, tab));
    setTabs(newTabs);
  }, []);

  function findTabByPath(newTabs: ITabProps[], path: string): number {
    const index = newTabs.map((e) => e.tabRoute).indexOf(path);
    return index;
  }

  function getTabs(): ITabProps[] {
    const newTabs: ITabProps[] = [];

    if (event.rankings.length > 0) {
      newTabs.push({
        tabRoute: "rankings",
        translationKey: "pages.event.subpages.rankings",
        component: () => <RankingTab key={"tab-rankings"} />
      });
    }

    if (event.matches.length > 0) {
      newTabs.push({
        tabRoute: "matches",
        translationKey: "pages.event.subpages.matches",
        component: () => <MatchesTab key={"tab-matches"} />
      });
    }

    if (event.teams.length > 0) {
      newTabs.push({
        tabRoute: "teams",
        translationKey: "pages.event.subpages.teams",
        component: () => <TeamsTab key={"tab-teams"} />
      });
    }

    if (event.alliances.length > 0) {
      newTabs.push({
        tabRoute: "alliances",
        translationKey: "pages.event.subpages.alliances",
        component: () => <AlliancesTab key={"tab-alliances"} />
      });
    }

    if (event.awards.length) {
      newTabs.push({
        tabRoute: "awards",
        translationKey: "pages.event.subpages.awards",
        component: () => <AwardsTab key={"tab-awards"} />
      });
    }

    if (event.insights.length > 0) {
      newTabs.push({
        tabRoute: "insights",
        translationKey: "pages.event.subpages.insights",
        component: () => <InsightsTab key={"tab-insights"} />
      });
    }

    return newTabs;
  }

  function tabHandler(e: SyntheticEvent, value: number) {
    history.replace(`/events/${eventCode}/${tabs[value].tabRoute}`);
    setSelectedTab(value);
  }

  function getSelectedTab(): React.ReactElement {
    return tabs[selectedTab].component();
  }

  return (
    <>
      {tabs && tabs.length > 0 && (
        <div className='event-tabs'>
          <Tabs
            onChange={tabHandler}
            value={selectedTab}
            variant='fullWidth'
            textColor='primary'
            indicatorColor='primary'
            scrollButtons='auto'
          >
            {tabs.map((tb: ITabProps, i: number) => {
              return <Tab value={i} key={tb.tabRoute} label={t(tb.translationKey + ".title")} />;
            })}
          </Tabs>
          {selectedTab > -1 && getSelectedTab()}
        </div>
      )}
      {!tabs || (tabs && tabs.length < 1 && <div className={"event-tabs text-center"}>{t("no_data.event_long")}</div>)}
    </>
  );
};

export default EventTabs;
