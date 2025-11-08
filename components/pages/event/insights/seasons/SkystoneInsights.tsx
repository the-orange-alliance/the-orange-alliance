import { Grid, Typography } from '@mui/material';
import type SkystoneInsights from '@the-orange-alliance/api/lib/esm/models/game-specifics/1920/SkystoneInsights';
import React from 'react';
import InsightCell from '../InsightCell';

const AutonBreakout = function ({ insight }: { insight: SkystoneInsights }) {
  const total = insight.autoAverageSkystonesDelivered + insight.autoAverageStonesDelivered;
  return (
    <Grid container sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
      <Grid size={12}>
        <Typography>Auton Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="avg_skystone_delivered"
        value={(insight.autoAverageSkystonesDelivered / total) * 100}
        label={insight.autoAverageSkystonesDelivered + ''}
        percent={false}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="avg_stone_delivered"
        value={(insight.autoAverageStonesDelivered / total) * 100}
        label={insight.autoAverageStonesDelivered + ''}
        percent={false}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="avg_parked"
        value={insight.autoPercentParked}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="avg_placed"
        value={insight.autoAveragePlaced}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="foundations_repositioned"
        value={insight.percentFoundationRepositioned}
        year="1920"
      ></InsightCell>
    </Grid>
  );
};

const TeleopBreakout = function ({ insight }: { insight: SkystoneInsights }) {
  const total =
    insight.teleAverageReturned + insight.teleAveragePlaced + insight.teleAverageDelivered;
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid size={12}>
        <Typography>Teleop Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="returned"
        value={(insight.teleAverageReturned / total) * 100}
        label={insight.teleAverageReturned + ''}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="placed"
        value={(insight.teleAveragePlaced / total) * 100}
        label={insight.teleAveragePlaced + ''}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="delivered"
        value={(insight.teleAverageDelivered / total) * 100}
        label={insight.teleAverageDelivered + ''}
        year="1920"
      ></InsightCell>
    </Grid>
  );
};

const EndgameBreakout = function ({ insight }: { insight: SkystoneInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid size={12}>
        <Typography>End Game Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="cap_level"
        value={insight.endAverageCapLevel}
        percent={false}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="parked"
        value={insight.endPercentParked}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="foundation_moved"
        value={insight.percentFoundationMoved}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="tower_bonus"
        value={insight.endAverageTowerBonus}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="cap_bonus"
        value={insight.endAverageCapBonus}
        year="1920"
      ></InsightCell>
      <InsightCell
        translationKey="level_bonus"
        value={insight.endAverageLevelBonus}
        year="1920"
      ></InsightCell>
    </Grid>
  );
};

const Breakout = function ({ insight }: { insight: SkystoneInsights }) {
  return (
    <>
      <hr />
      <AutonBreakout insight={insight} />
      <hr />
      <TeleopBreakout insight={insight} />
      <hr />
      <EndgameBreakout insight={insight} />
    </>
  );
};

export default Breakout;
