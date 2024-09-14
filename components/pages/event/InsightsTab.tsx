import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography
} from '@mui/material';
import { Insights, Event } from '@the-orange-alliance/api/lib/cjs/models';
import seasonInsights from './insights/seasons';

interface IProps {
  event: Event;
}

const InsightsTab = (props: IProps) => {
  const { insights, seasonKey } = props.event;

  const qualInsights = insights.length > 0 ? insights[0] : new Insights();
  const elimInsights = insights.length > 1 ? insights[1] : new Insights();

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {qualInsights && (
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardHeader title="Qualification"></CardHeader>
            <CardContent>
              <CardContentList season={seasonKey} insight={qualInsights}></CardContentList>
            </CardContent>
          </Card>
        </Grid>
      )}
      {elimInsights && (
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardHeader title="Playoff"></CardHeader>
            <CardContent>
              <CardContentList season={seasonKey} insight={elimInsights}></CardContentList>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

const CardContentList = function ({ insight, season }: { insight: Insights; season: string }) {
  return (
    <List>
      <ListItem
        component="a"
        button
        href={insight.highScoreMatch ? `/matches/${insight.highScoreMatch.matchKey}` : undefined}
        dense
      >
        <ListItemText
          primary="High Score"
          primaryTypographyProps={{ variant: 'button' }}
          secondary={
            (insight.highScoreMatch
              ? insight.highScoreMatch.redScore > insight.highScoreMatch.blueScore
                ? insight.highScoreMatch.redScore
                : insight.highScoreMatch.blueScore
              : '') +
            ' - ' +
            (insight.highScoreMatch ? insight.highScoreMatch.matchName : '')
          }
        />
      </ListItem>
      <ListItem dense>
        <ListItemText
          primary="Average Score"
          primaryTypographyProps={{ variant: 'button' }}
          secondary={insight.averageMatchScore}
        />
      </ListItem>
      <ListItem dense>
        <ListItemText
          primary="Average Win Score"
          primaryTypographyProps={{ variant: 'button' }}
          secondary={insight.averageWinningScore}
        />
      </ListItem>
      <ListItem dense>
        <ListItemText
          primary="Average Win Margin"
          primaryTypographyProps={{ variant: 'button' }}
          secondary={insight.averageWinningMargin}
        />
      </ListItem>
      {insightSeasonBreakdown({ insight, season })}
    </List>
  );
};

const insightSeasonBreakdown = function ({ insight, season }: { insight: any; season: string }) {
  const Insights = seasonInsights(season);
  return <Insights insight={insight}></Insights>;
};

export default InsightsTab;
