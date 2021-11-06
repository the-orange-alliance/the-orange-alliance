import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PeopleIcon from "@mui/icons-material/People";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import {
  ISetHighScoreElims,
  ISetHighScoreOverall,
  ISetHighScoreQuals,
  ISetTotalEventSize,
  ISetTotalTeamSize,
  setHighScoreElims,
  setHighScoreOverall,
  setHighScoreQuals,
  setTotalEventSize,
  setTotalTeamSize,
  IApplicationState,
  IHighestScoringMatches,
  getHomeData,
  IHomeProps
} from "shared";
import { useSelector, useDispatch } from "react-redux";
import Match from "@the-orange-alliance/api/lib/esm/models/Match";

// Component declarations
import StatisticCard from "../../components/StatisticCard";
import AnnouncementCard from "../../components/AnnouncementCard";

// module declarations
import LeaderboardsModule from "../../modules/LeaderboardsModule";
import { useTranslation } from "react-i18next";

interface IProps {
  eventSize: number;
  teamSize: number;
  highScoreMatches: IHighestScoringMatches;
  setEventSize: (size: number) => ISetTotalEventSize;
  setTeamSize: (size: number) => ISetTotalTeamSize;
  setHighScoreOverall: (match: Match) => ISetHighScoreOverall;
  setHighScoreQuals: (match: Match) => ISetHighScoreQuals;
  setHighScoreElims: (match: Match) => ISetHighScoreElims;
}

const HomePage = () => {
  const { t } = useTranslation();
  const eventSize = useSelector((state: IApplicationState) => state.eventsTotal);
  const teamSize = useSelector((state: IApplicationState) => state.teamsTotal);
  const highScoreMatches = useSelector((state: IApplicationState) => state.highScoreMatches);

  const dispatch = useDispatch();

  const setEventSize = (size: number) => {
    dispatch(setTotalEventSize(size));
  };
  const setTeamSize = (size: number) => {
    dispatch(setTotalTeamSize(size));
  };
  const setHSOverall = (match: Match) => {
    dispatch(setHighScoreOverall(match));
  };
  const setHSQuals = (match: Match) => {
    dispatch(setHighScoreQuals(match));
  };
  const setHSElims = (match: Match) => {
    dispatch(setHighScoreElims(match));
  };

  React.useEffect(() => {
    getHomeData({ eventSize, teamSize, highScoreMatches }).then((data: IHomeProps) => {
      setEventSize(data.eventSize);
      setTeamSize(data.teamSize);
      setHSOverall(data.highScoreMatches.overall);
      setHSQuals(data.highScoreMatches.quals);
      setHSElims(data.highScoreMatches.elims);
    });
  }, []);

  return (
    <div>
      <Typography align={"center"} variant={"h3"} gutterBottom>
        The Orange Alliance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6}>
              <StatisticCard title={`${eventSize}`} subtitle={t("general.events")} icon={<PeopleIcon />} />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <StatisticCard
                title={`${teamSize}`}
                subtitle={t("pages.home.active_teams")}
                icon={<SportsEsportsIcon />}
              />
            </Grid>
            <Grid item xs={12}>
              <AnnouncementCard
                content={
                  <Typography variant={"body1"}>
                    Due to the COVID-19 (Coronavirus) pandemic, <i>FIRST</i> has suspended all events for the duration
                    of the season including the <i>FIRST</i> Championships. Refer to{" "}
                    <a href='https://www.firstinspires.org/covid-19'>firstinspires.org/covid-19</a> for more
                    information.
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          {/* This is temporary. ReactDOMServer does not support Suspense, yet. */}
          <LeaderboardsModule highScoreMatches={highScoreMatches} />
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
