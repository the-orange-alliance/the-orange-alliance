import { Grid, Typography } from '@mui/material';
import type PowerPlayInsights from '@the-orange-alliance/api/lib/esm/models/game-specifics/2223/PowerPlayInsights';
import React from 'react';
import InsightCell from '../InsightCell';

const AutonBreakout = function ({ insight }: { insight: PowerPlayInsights }) {
  return (
    <Grid container sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
      <Grid item xs={12}>
        <Typography>Auton Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="percent_signal_sleeves"
        value={insight.autoPercentSignalSleeves}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="percent_terminal_substation"
        value={insight.autoPercentTerminalSubstation}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="percent_signal_zone"
        value={insight.autoPercentSignalZone}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_high_junction"
        value={insight.autoAverageHighJunctions}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_mid_junction"
        value={insight.autoAverageMidJunctions}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_low_junction"
        value={insight.autoAverageLowJunctions}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_ground_junction"
        value={insight.autoAverageGroundJunctions}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_terminal_general"
        value={insight.autoAverageTerminal}
        year="2223"
      ></InsightCell>
    </Grid>
  );
};

const TeleopBreakout = function ({ insight }: { insight: PowerPlayInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Typography>Teleop Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="avg_high_junction"
        value={insight.teleAverageHighJunctions}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_mid_junction"
        value={insight.teleAverageMidJunctions}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_low_junction"
        value={insight.teleAverageLowJunctions}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_ground_junction"
        value={insight.teleAverageGroundJunctions}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_terminal_near"
        value={insight.teleAverageTerminalNear}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_terminal_far"
        value={insight.teleAverageTerminalFar}
        year="2223"
      ></InsightCell>
    </Grid>
  );
};

const EndgameBreakout = function ({ insight }: { insight: PowerPlayInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Typography>End Game Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="percent_navigated"
        value={insight.endPercentNavigated}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="percent_beacons_used"
        value={insight.endPercentBeacons}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="avg_owned_junctions"
        value={insight.endAverageOwnedJunctions}
        year="2223"
      ></InsightCell>
      <InsightCell
        translationKey="percent_circuits"
        year="2223"
        value={insight.endPercentCircuits}
      ></InsightCell>
    </Grid>
  );
};

const Breakout = function ({ insight }: { insight: PowerPlayInsights }) {
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
