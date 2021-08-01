import React from 'react';
import ReactDOM from 'react-dom';
import { interpolateSpectral, scaleSequential, scaleBand, scaleLinear, max, format, annotation, annotationLabel } from 'd3';
// import { Annotation, SubjectCircle, ConnectorElbow, ConnectorEndDot, Note } from 'd3-annotation'
import { useWorldAtlas } from './useWorldAtlas';
import { useData } from './useData';
import { useCodes } from './useCodes';
import { useDataBar, useDataBarReverse } from './useDataBar';
import { Marks } from './Marks';
import { BarMarks } from './BarMarks';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';

const width = 1200;
const height = 750;
const mapMargin = { top: 60, right: 30, bottom: 65, left: 85 };
const graphMargin = { top: 50, right: 90, bottom: 120, left: 120 };
const xAxisLabelOffset = 50;

const App = () => {
  // map
  const worldAtlas = useWorldAtlas();
  const data = useData();
  const codes = useCodes();

  if (!worldAtlas || !data || !codes) {
    return <pre>Loading Visualization...</pre>;
  }
  
  const numericCodeByAlphaCode = new Map();
  codes.forEach(code => {
    const alpha3Code = code['alpha-3'];
    const numericCode = code['country-code'];
    numericCodeByAlphaCode.set(alpha3Code, numericCode);
  });
  
  const rowByNumericCode = new Map();
  data.forEach(d => {
    const alpha3Code = d.Code;
    const numericCode = numericCodeByAlphaCode.get(alpha3Code);
    rowByNumericCode.set(numericCode, d);
  });

  const colorValue = d => d.Score;

  const colorScale = scaleSequential(interpolateSpectral).domain([
    4,
    max(data, colorValue)
  ]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${mapMargin.left},${mapMargin.top})`}>
        <Marks
          worldAtlas={worldAtlas}
          rowByNumericCode={rowByNumericCode}
          colorScale={colorScale}
          colorValue={colorValue}
        />
      </g>
    </svg>
  );
};

const MakeGraph = () => {
  // graph happy
  const data = useDataBar();

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const innerHeight = height - graphMargin.top - graphMargin.bottom;
  const innerWidth = width - graphMargin.left - graphMargin.right;

  const yValue = d => d['Country'];
  const xValue = d => d.Score;

  const siFormat = format('.2s');
  const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');

  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .paddingInner(0.15);

  const xScale = scaleLinear()
    .domain([0, 10])
    .range([0, innerWidth]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${graphMargin.left},${graphMargin.top})`}>
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={xAxisTickFormat}
        />
        <AxisLeft yScale={yScale} />
        <text
          className="axis-label"
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor="middle"
        >
          Score
        </text>
        <BarMarks
          data={data}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          tooltipFormat={xAxisTickFormat}
        />
      </g>
    </svg>
  );
};

const MakeGraph2 = () => {
  // graph happy
  const data = useDataBarReverse();

  if (!data) {
    return <pre>Loading...</pre>;
  }

  const innerHeight = height - graphMargin.top - graphMargin.bottom;
  const innerWidth = width - graphMargin.left - graphMargin.right;

  const yValue = d => d['Country'];
  const xValue = d => d.Score;

  const siFormat = format('.2s');
  const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');

  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .paddingInner(0.15);

  const xScale = scaleLinear()
    .domain([0, 10])
    .range([0, innerWidth]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${graphMargin.left},${graphMargin.top})`}>
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          tickFormat={xAxisTickFormat}
        />
        <AxisLeft yScale={yScale} />
        <text
          className="axis-label"
          x={innerWidth / 2}
          y={innerHeight + xAxisLabelOffset}
          textAnchor="middle"
        >
          Score
        </text>
        <BarMarks
          data={data}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          tooltipFormat={xAxisTickFormat}
        />
      </g>
    </svg>
  );
};

ReactDOM.render(
  <div>
    <svg width={width} height={height-600}></svg>
    <App/>,
  </div>, document.getElementById('root')
);
ReactDOM.render(
  <div>
    <MakeGraph/>,
  </div>, document.getElementById('root2')
);
ReactDOM.render(
  <div>
    <MakeGraph2/>,
  </div>, document.getElementById('root3')
);

