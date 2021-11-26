import React from 'react';
import FreightFrenzyInsights from './FreightFrenzyInsights';

const seasons: { [key: string]: (insights: any) => any } = {
  '2122': FreightFrenzyInsights
};

const seasonInsights = (season: string) => {
  if (season in seasons) {
    return seasons[season];
  } else {
    return () => null;
  }
};

export default seasonInsights;
