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
  IHomeProps,
  setTotalMatchSize
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
  const matchSize = useSelector((state: IApplicationState) => state.matchesTotal);
  const highScoreMatches = useSelector((state: IApplicationState) => state.highScoreMatches);

  const dispatch = useDispatch();

  const setEventSize = (size: number) => {
    dispatch(setTotalEventSize(size));
  };
  const setTeamSize = (size: number) => {
    dispatch(setTotalTeamSize(size));
  };
  const setMatchSize = (size: number) => {
    dispatch(setTotalMatchSize(size));
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
    getHomeData({ eventSize, teamSize, matchSize, highScoreMatches }).then((data: IHomeProps) => {
      setEventSize(data.eventSize);
      setTeamSize(data.teamSize);
      setMatchSize(data.matchSize);
      setHSOverall(data.highScoreMatches.overall);
      setHSQuals(data.highScoreMatches.quals);
      setHSElims(data.highScoreMatches.elims);
    });
  }, []);

  return <></>;
};

export default HomePage;
