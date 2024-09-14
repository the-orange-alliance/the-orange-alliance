import { Grid, Typography } from '@mui/material';
import type UltimateGoalInsights from '@the-orange-alliance/api/lib/esm/models/game-specifics/2021/UltimateGoalInsights';
import React from 'react';
import InsightCell from '../InsightCell';

const AutonBreakout = function ({ insight }: { insight: UltimateGoalInsights }) {
  const total_rings =
    insight.autoAverageRingsScoredHigh +
    insight.autoAverageRingsScoredMid +
    insight.autoAverageRingsScoredLow;
  return (
    <Grid container sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
      <Grid item xs={12}>
        <Typography>Auton Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="avg_high_rings"
        value={(insight.autoAverageRingsScoredHigh / total_rings) * 100}
        label={insight.autoAverageRingsScoredHigh + ''}
        year="2021"
      ></InsightCell>
      <InsightCell
        translationKey="avg_middle_rings"
        value={(insight.autoAverageRingsScoredMid / total_rings) * 100}
        label={insight.autoAverageRingsScoredMid + ''}
        year="2021"
      ></InsightCell>
      <InsightCell
        translationKey="avg_low_rings"
        value={(insight.autoAverageRingsScoredLow / total_rings) * 100}
        label={insight.autoAverageRingsScoredLow + ''}
        year="2021"
      ></InsightCell>
      <InsightCell
        translationKey="avg_powershots_hit"
        value={insight.autoAveragePowerShots}
        year="2021"
        percent={false}
      ></InsightCell>
      <InsightCell
        translationKey="wobble_goals_delivered"
        value={insight.autoPercentWobblesDelivered}
        year="2021"
      ></InsightCell>
      <InsightCell
        translationKey="parked_on_line"
        value={insight.autoPercentNavigated}
        year="2021"
      ></InsightCell>
    </Grid>
  );
};

const TeleopBreakout = function ({ insight }: { insight: UltimateGoalInsights }) {
  const total_rings =
    insight.teleAverageRingsScoredHigh +
    insight.teleAverageRingsScoredMid +
    insight.teleAverageRingsScoredLow;
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Typography>Teleop Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="avg_high_rings"
        value={(insight.teleAverageRingsScoredHigh / total_rings) * 100}
        label={insight.teleAverageRingsScoredHigh + ''}
        year="2021"
      ></InsightCell>
      <InsightCell
        translationKey="avg_middle_rings"
        value={(insight.teleAverageRingsScoredMid / total_rings) * 100}
        label={insight.teleAverageRingsScoredMid + ''}
        year="2021"
      ></InsightCell>
      <InsightCell
        translationKey="avg_low_rings"
        value={(insight.teleAverageRingsScoredLow / total_rings) * 100}
        label={insight.teleAverageRingsScoredLow + ''}
        year="2021"
      ></InsightCell>
    </Grid>
  );
};

const EndgameBreakout = function ({ insight }: { insight: UltimateGoalInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Typography>End Game Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="avg_wobble_goal_rings"
        value={insight.endAverageRingsOnWobble}
        percent={false}
        year="2021"
      ></InsightCell>
      <InsightCell
        translationKey="avg_powershots_hit"
        value={insight.endAveragePowerShots}
        percent={false}
        year="2021"
      ></InsightCell>
      <InsightCell
        translationKey="wobble_goal_start"
        value={insight.endPercentWobblesOnStart}
        year="2021"
      ></InsightCell>
      <InsightCell
        translationKey="wobble_goal_drop_zone"
        value={insight.endPercentWobblesInDropZone}
        year="2021"
      ></InsightCell>
    </Grid>
  );
};

const Breakout = function ({ insight }: { insight: UltimateGoalInsights }) {
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
