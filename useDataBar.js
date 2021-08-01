import React, { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://raw.githubusercontent.com/albertzarate/WorldHappinessNarrative/master/data/world_happiness_2021.csv';

export const useDataBar = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = d => {
      d.Score = +d['Score'];
      return d;
    };
    csv(csvUrl, row).then(data => {
      setData(data.slice(0, 10));
    });
  }, []);
  
  return data;
};

export const useDataBarReverse = () => {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      const row = d => {
        d.Score = +d['Score'];
        return d;
      };
      csv(csvUrl, row).then(data => {
        setData(data.slice(-10,));
      });
    }, []);
    
    return data;
  };