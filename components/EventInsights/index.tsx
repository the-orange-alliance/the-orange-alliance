import React from 'react';
import FreightFrenzyInsights from './FreightFrenzyInsights';
import UltimateGoalInsights from './UltimateGoalInsights';
import SkystoneInsights from './SkystoneInsights';
import RoverRuckusInsights from './RoverRuckusInsights';

const seasons: { [key: string]: (insights: any) => any } = {
  '2122': FreightFrenzyInsights,
  '2021': UltimateGoalInsights,
  '1920': SkystoneInsights,
  '1819': RoverRuckusInsights
};

const seasonInsights = (season: string) => {
  if (season in seasons) {
    return seasons[season];
  } else {
    return () => null;
  }
};

export default seasonInsights;
