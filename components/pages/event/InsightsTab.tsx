import NextLink from 'next/link';
import { Grid, Card, CardHeader, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { Insights, Event } from '@the-orange-alliance/api/lib/cjs/models';
import seasonInsights from './insights/seasons';

import ListItemButton from '@mui/material/ListItemButton';

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
        <Grid
          size={{
            xs: 12,
            sm: 6
          }}
        >
          <Card variant="outlined">
            <CardHeader title="Qualification"></CardHeader>
            <CardContent sx={{ py: 0 }}>
              <CardContentList season={seasonKey} insight={qualInsights}></CardContentList>
            </CardContent>
          </Card>
        </Grid>
      )}
      {elimInsights && (
        <Grid
          size={{
            xs: 12,
            sm: 6
          }}
        >
          <Card variant="outlined">
            <CardHeader title="Playoff"></CardHeader>
            <CardContent sx={{ py: 0 }}>
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
      <NextLink
        href={insight.highScoreMatch ? `/matches/${insight.highScoreMatch.matchKey}` : '#'}
        passHref
        legacyBehavior
      >
        <ListItemButton component="a" dense>
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
        </ListItemButton>
      </NextLink>
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
