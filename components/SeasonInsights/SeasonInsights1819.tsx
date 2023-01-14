import RoverRuckusInsights from '@the-orange-alliance/api/lib/cjs/models/game-specifics/1819/RoverRuckusInsights';
import { Grid } from '@mui/material';
import { getWeekShort } from '../../lib/utils/common';
import { Insights } from '@the-orange-alliance/api/lib/cjs/models';
import Chart from '../Chart';

interface IProps {
  insights: { [key: string]: Insights };
}

const SeasonInsights1819 = (props: IProps) => {
  const insights = Object.values(props.insights) as RoverRuckusInsights[];
  const labels = Object.keys(props.insights).map(getWeekShort);

  return (
    <>
      <Grid container spacing={4} justifyContent="center">
        {/* Auto Landing */}
        <Chart
          {...{
            insights,
            labels,
            title: 'Autonomous Landing',
            dataLabels: {
              autoPercentLanding: 'Percent Landed'
            }
          }}
        />

        {/* Sample/Claiming */}
        <Chart
          {...{
            insights,
            labels,
            title: 'Autonomous Sampling/Claiming',
            dataLabels: {
              autoPercentSampling: 'Percent Sampled',
              autoPercentClaiming: 'Percent Claimed'
            }
          }}
        />

        {/* Parking */}
        <Chart
          {...{
            insights,
            labels,
            title: 'Autonomous Parking',
            dataLabels: {
              autoPercentParking: 'Percent Parked'
            }
          }}
        />

        {/* Tele Scoring */}
        <Chart
          {...{
            insights,
            labels,
            title: 'Teleop Gold, Silver, and Depot',
            dataLabels: {
              teleAvgGolds: 'Average Golds',
              teleAvgSilvers: 'Average Silvers',
              teleAvgDepotMinerals: 'Average Depot Minerals'
            }
          }}
        />

        {/* End Parking */}
        <Chart
          {...{
            insights,
            labels,
            title: 'Endgame Parking',
            dataLabels: {
              endPercentLatched: 'Percent Latched',
              endPercentParked: 'Percent Parked'
            }
          }}
        />
      </Grid>
    </>
  );
};

export default SeasonInsights1819;
