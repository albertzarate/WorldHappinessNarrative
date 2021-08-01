import { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://raw.githubusercontent.com/albertzarate/WorldHappinessNarrative/master/data/world_happiness_2021.csv';

const row = d => {
  d.Score = +d['Score'];
  return d;
};

export const useData = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    csv(csvUrl, row).then(setData);
  }, []);

  return data;
};
