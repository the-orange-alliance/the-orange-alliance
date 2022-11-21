import RelicRecoveryInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/1718/RelicRecoveryInsights';
import { Grid, Typography } from '@mui/material';
import { getWeekShort } from '../../lib/utils/common';
import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import Chart from '../Chart';

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights1718 = (props: IProps) => {
  const insights = Object.values(props.insights) as RelicRecoveryInsights[];
  const labels = Object.keys(props.insights).map(getWeekShort);

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Glyphs */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['autoAverageGlyphs'],
            dataLabels: {
              autoAverageGlyphs: 'Avg Glyphs'
            },
            title: 'Autonomous Glyphs'
          }}
        />

        {/* Glyphs/Ciphers */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['teleAverageGlyphs', 'teleAverageCiphers'],
            dataLabels: {
              teleAverageGlyphs: 'Avg Glyphs',
              teleAverageCiphers: 'Avg Ciphers'
            },
            title: 'Teleop Glyphs and Ciphers'
          }}
        />

        {/* End Relics */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['endAverageRelic1', 'endAverageRelic2', 'endAverageRelic3'],
            dataLabels: {
              endAverageRelic1: 'Avg Relic 1',
              endAverageRelic2: 'Avg Relic 2',
              endAverageRelic3: 'Avg Relic 3'
            },
            title: 'Endgame Relics'
          }}
        />

        {/* Relics Standing */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['endPercentRelicStanding'],
            dataLabels: {
              endPercentRelicStanding: 'Percent Standing'
            },
            title: 'End Game Relics Standing'
          }}
        />

        {/* End Balanced */}
        <Chart
          {...{
            insights,
            labels,
            keys: ['endAverageBalanced'],
            dataLabels: {
              endAverageBalanced: 'Avg Balanced'
            },
            title: 'End Game Balanced'
          }}
        />
      </Grid>
    </>
  );
};

export default SeasonInsights1718;
