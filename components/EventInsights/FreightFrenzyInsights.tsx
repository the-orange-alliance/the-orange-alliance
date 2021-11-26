import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import FreightFrenzyInsights from '@the-orange-alliance/api/lib/esm/models/game-specifics/2122/FreightFrenzyInsights';
import React from 'react';
import { useTranslate } from '../../i18n/i18n';
import CircularProgressWithLabel from './CircularProgressWithLabel';

const InsightCell = function ({
  value,
  translationKey
}: {
  value: number;
  translationKey: string;
}) {
  const lang = useTranslate();
  return (
    <Grid
      item
      container
      xs={6}
      md={4}
      xl={3}
      sx={{ alignContent: 'space-between', padding: '.5em' }}
    >
      <Typography sx={{ textAlign: 'center', textTransform: 'uppercase', fontSize: '.75em' }}>
        {lang(`pages.event.subpages.insights.2122.${translationKey}`)}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}>
        <CircularProgressWithLabel value={value}></CircularProgressWithLabel>
      </Box>
    </Grid>
  );
};

const AutonBreakout = function ({ insight }: { insight: FreightFrenzyInsights }) {
  return (
    <Grid container sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
      <Grid item xs={12}>
        <Typography>Auton Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey={'partially_in_storage'}
        value={insight.autoAveragePartialStorage}
      ></InsightCell>
      <InsightCell
        translationKey={'completely_in_storage'}
        value={insight.autoAverageCompleteStorage}
      ></InsightCell>
      <InsightCell
        translationKey={'partially_in_warehouse'}
        value={insight.autoAveragePartialWarehouse}
      ></InsightCell>
      <InsightCell
        translationKey={'completely_in_warehouse'}
        value={insight.autoAverageCompleteWarehouse}
      ></InsightCell>
      <InsightCell
        translationKey={'avg_lvl_1_freight'}
        value={insight.autoAverageFreight1}
      ></InsightCell>
      <InsightCell
        translationKey={'avg_lvl_2_freight'}
        value={insight.autoAverageFreight2}
      ></InsightCell>
      <InsightCell
        translationKey={'avg_lvl_3_freight'}
        value={insight.autoAverageFreight3}
      ></InsightCell>
      <InsightCell
        translationKey={'avg_storage_freight'}
        value={insight.autoAverageStorageFreight}
      ></InsightCell>
      <InsightCell
        translationKey={'percent_bonuses_earned'}
        value={insight.autoAverageBonus}
      ></InsightCell>
    </Grid>
  );
};

const TeleopBreakout = function ({ insight }: { insight: FreightFrenzyInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Typography>Teleop Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey={'avg_lvl_1_freight'}
        value={insight.teleAverageFreight1}
      ></InsightCell>
      <InsightCell
        translationKey={'avg_lvl_2_freight'}
        value={insight.teleAverageFreight2}
      ></InsightCell>
      <InsightCell
        translationKey={'avg_lvl_3_freight'}
        value={insight.teleAverageFreight3}
      ></InsightCell>
      <InsightCell
        translationKey={'avg_storage_freight'}
        value={insight.teleAverageSharedFreight}
      ></InsightCell>
    </Grid>
  );
};

const EndgameBreakout = function ({ insight }: { insight: FreightFrenzyInsights }) {
  return (
    <Grid spacing={2} container sx={{ justifyContent: 'center' }}>
      <Grid item xs={12}>
        <Typography>End Game Breakout</Typography>
      </Grid>
      <InsightCell
        translationKey={'alliance_hubs_balanced'}
        value={insight.endAverageHubBalanced}
      ></InsightCell>
      <InsightCell
        translationKey={'shared_hubs_unbalanced'}
        value={insight.endAverageSharedHubUnbalanced}
      ></InsightCell>
      <InsightCell
        translationKey={'partially_in_warehouse'}
        value={insight.endParkedPartialWarehouse}
      ></InsightCell>
      <InsightCell
        translationKey={'completely_in_warehouse'}
        value={insight.endParkedCompleteWarehouse}
      ></InsightCell>
      <InsightCell translationKey={'capped'} value={insight.averageCapped}></InsightCell>
      <InsightCell translationKey={'carousels'} value={insight.averageCarousel}></InsightCell>
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
