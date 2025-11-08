import { Grid, Typography } from '@mui/material';
import type FreightFrenzyInsights from '@the-orange-alliance/api/lib/esm/models/game-specifics/2122/FreightFrenzyInsights';
import React from 'react';
import InsightCell from '../InsightCell';

const AutonBreakout = function ({ insight }: { insight: FreightFrenzyInsights }) {
  return (
    <Grid container sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
      <Grid size={12}>
        <Typography>Auton Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="partially_in_storage"
        value={insight.autoAveragePartialStorage}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="completely_in_storage"
        value={insight.autoAverageCompleteStorage}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="partially_in_warehouse"
        value={insight.autoAveragePartialWarehouse}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="completely_in_warehouse"
        value={insight.autoAverageCompleteWarehouse}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="avg_lvl_1_freight"
        value={insight.autoAverageFreight1}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="avg_lvl_2_freight"
        value={insight.autoAverageFreight2}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="avg_lvl_3_freight"
        value={insight.autoAverageFreight3}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="avg_storage_freight"
        value={insight.autoAverageStorageFreight}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="percent_bonuses_earned"
        value={insight.autoAverageBonus}
        year="2122"
      ></InsightCell>
    </Grid>
  );
};

const TeleopBreakout = function ({ insight }: { insight: FreightFrenzyInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid size={12}>
        <Typography>Teleop Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="avg_lvl_1_freight"
        value={insight.teleAverageFreight1}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="avg_lvl_2_freight"
        value={insight.teleAverageFreight2}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="avg_lvl_3_freight"
        value={insight.teleAverageFreight3}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="avg_storage_freight"
        value={insight.teleAverageSharedFreight}
        year="2122"
      ></InsightCell>
    </Grid>
  );
};

const EndgameBreakout = function ({ insight }: { insight: FreightFrenzyInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid size={12}>
        <Typography>End Game Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey="alliance_hubs_balanced"
        value={insight.endAverageHubBalanced}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="shared_hubs_unbalanced"
        value={insight.endAverageSharedHubUnbalanced}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="partially_in_warehouse"
        value={insight.endParkedPartialWarehouse}
        year="2122"
      ></InsightCell>
      <InsightCell
        translationKey="completely_in_warehouse"
        year="2122"
        value={insight.endParkedCompleteWarehouse}
      ></InsightCell>
      <InsightCell translationKey="capped" value={insight.averageCapped} year="2122"></InsightCell>
      <InsightCell
        translationKey="carousels"
        value={insight.averageCarousel}
        year="2122"
      ></InsightCell>
    </Grid>
  );
};

const Breakout = function ({ insight }: { insight: FreightFrenzyInsights }) {
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
