import * as React from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Grid,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  Typography,
  ListItemText
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { IApplicationState, setEventMatches, getEventMatches, getEventInsights, setEventInsights } from "shared";
import { Match, EventParticipant, Alliance, Insights } from "@the-orange-alliance/api/lib/esm/models";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

const InsightsTab = function () {
  const { t } = useTranslation();
  const { eventCode } = useParams<{ eventCode: string }>();
  const dispatch = useDispatch();
  function loadEventInsights() {
    getEventInsights(eventCode).then((data: Insights[]) => {
      dispatch(setEventInsights(data));
    });
  }

  React.useEffect(() => {
    loadEventInsights();
  }, []);
  const insights = useSelector((state: IApplicationState) => state.currentEventInsights);

  const qualInsights = insights.length > 0 ? insights[0] : new Insights();
  const elimInsights = insights.length > 1 ? insights[1] : new Insights();

  return (
    <Grid container spacing={8}>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardHeader title='Qualification'></CardHeader>
          <CardContent>
            <CardContentList insight={qualInsights}></CardContentList>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card>
          <CardHeader title='Playoff'></CardHeader>
          <CardContent>
            <CardContentList insight={elimInsights}></CardContentList>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const CardContentList = function ({ insight }: { insight: Insights }) {
  return (
    <List>
      <ListItem
        component='a'
        button
        href={insight.highScoreMatch ? `/matches/${insight.highScoreMatch.matchKey}` : undefined}
      >
        <ListItemText
          primary={"High Score"}
          primaryTypographyProps={{ variant: "button" }}
          secondary={
            (insight.highScoreMatch
              ? insight.highScoreMatch.redScore > insight.highScoreMatch.blueScore
                ? insight.highScoreMatch.redScore
                : insight.highScoreMatch.blueScore
              : "") +
            " - " +
            (insight.highScoreMatch ? insight.highScoreMatch.matchName : "")
          }
        ></ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText
          primary={"Average Score"}
          primaryTypographyProps={{ variant: "button" }}
          secondary={insight.averageMatchScore}
        ></ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText
          primary={"Average Win Score"}
          primaryTypographyProps={{ variant: "button" }}
          secondary={insight.averageWinningScore}
        ></ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText
          primary={"Average Win Margin"}
          primaryTypographyProps={{ variant: "button" }}
          secondary={insight.averageWinningMargin}
        ></ListItemText>
      </ListItem>
    </List>
  );
};

export default InsightsTab;
