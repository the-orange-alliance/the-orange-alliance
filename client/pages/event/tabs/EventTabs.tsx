import * as React from "react";
import { Tabs, AppBar, Tab } from "@mui/material";
import { RankingTab, MatchesTab, TeamsTab, AlliancesTab, AwardsTab, InsightsTab } from "./index";
import { useTranslation } from "react-i18next";

interface IProps {
  currentTab: string;
  handleTabChange: (tab: string) => void;
}

interface ITabProps {
  tabRoute: string;
  translationKey: string;
  component: () => React.ReactElement;
}

const tabs: ITabProps[] = [
  {
    tabRoute: "rankings",
    translationKey: "pages.event.subpages.rankings",
    component: () => <RankingTab />
  },
  {
    tabRoute: "matches",
    translationKey: "pages.event.subpages.matches",
    component: () => <MatchesTab />
  },
  {
    tabRoute: "teams",
    translationKey: "pages.event.subpages.teams",
    component: () => <TeamsTab />
  },
  {
    tabRoute: "alliances",
    translationKey: "pages.event.subpages.alliances",
    component: () => <AlliancesTab />
  },
  {
    tabRoute: "awards",
    translationKey: "pages.event.subpages.awards",
    component: () => <AwardsTab />
  },
  {
    tabRoute: "insights",
    translationKey: "pages.event.subpages.insights",
    component: () => <InsightsTab />
  }
];

const findTabByPath = (path: string): ITabProps => {
  const index = tabs.map((e) => e.tabRoute).indexOf(path);
  return tabs[index];
};

const EventTabs = function ({ currentTab, handleTabChange }: IProps) {
  const { t } = useTranslation();
  const tab = findTabByPath(currentTab);
  return (
    <div className='event-tabs'>
      <Tabs
        onChange={(event, value: string) => {
          handleTabChange(value);
        }}
        value={currentTab}
        variant='scrollable'
        textColor='primary'
        indicatorColor='primary'
        scrollButtons='auto'
      >
        {tabs.map((tab: ITabProps) => {
          return <Tab value={tab.tabRoute} label={t(tab.translationKey + ".title")} />;
        })}
      </Tabs>
      <tab.component key={`tab-${tab.tabRoute}`}></tab.component>
    </div>
  );
};

export default EventTabs;
