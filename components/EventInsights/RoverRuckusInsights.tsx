import { Grid, Typography } from '@mui/material';
import type RoverRuckusInsights from '@the-orange-alliance/api/lib/esm/models/game-specifics/1819/RoverRuckusInsights';
import React from 'react';
import InsightCell from './InsightCell';

const AutonBreakout = function ({ insight }: { insight: RoverRuckusInsights }) {
  return (
    <Grid container sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
      <Grid item xs={12}>
        <Typography>Auton Breakout</Typography>
      </Grid>

      <InsightCell
        translationKey={'successful_samples'}
        value={insight.autoPercentSampling}
        year="1819"
      ></InsightCell>
    </Grid>
  );
};

const TeleopBreakout = function ({ insight }: { insight: RoverRuckusInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Typography>Teleop Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey={'depots_claimed'}
        value={insight.teleAvgDepotMinerals}
        year="1819"
      ></InsightCell>

      <InsightCell
        translationKey={'gold_cargo_hold'}
        value={insight.teleAvgGolds}
        percent={false}
        year="1819"
      ></InsightCell>
      <InsightCell
        translationKey={'silver_cargo_hold'}
        value={insight.teleAvgSilvers}
        percent={false}
        year="1819"
      ></InsightCell>
      <InsightCell
        translationKey={'minerals_depot'}
        value={insight.teleAvgDepotMinerals}
        percent={false}
        year="1819"
      ></InsightCell>
    </Grid>
  );
};

const EndgameBreakout = function ({ insight }: { insight: RoverRuckusInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Typography>End Game Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey={'parked_robots'}
        value={insight.endPercentParked}
        year="1819"
      ></InsightCell>
      <InsightCell
        translationKey={'landed_robots'}
        value={insight.autoPercentLanding}
        year="1819"
      ></InsightCell>
      <InsightCell
        translationKey={'latched_robots'}
        value={insight.endPercentLatched}
        year="1819"
      ></InsightCell>
    </Grid>
  );
};

const Breakout = function ({ insight }: { insight: RoverRuckusInsights }) {
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
