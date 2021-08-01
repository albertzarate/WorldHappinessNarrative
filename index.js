import React from 'react';
import ReactDOM from 'react-dom';
import { interpolateSpectral, scaleSequential, scaleBand, scaleLinear, max, format, annotation } from 'd3';
// import { Annotation, SubjectCircle, ConnectorElbow, ConnectorEndDot, Note } from 'd3-annotation'
import { useWorldAtlas } from './useWorldAtlas';
import { useData } from './useData';
import { useCodes } from './useCodes';
import { useDataBar } from './useDataBar';
import { Marks } from './Marks';
import { BarMarks } from './BarMarks';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';

const width = 1200;
const height = 750;
const mapMargin = { top: 60, right: 30, bottom: 65, left: 85 };
const graphMargin = { top: 20, right: 30, bottom: 65, left: 220 };
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

  const annotations = [
    {
      note: {
        label: "Here is the annotation label",
        title: "Annotation title"
      },
      x: 100,
      y: 100,
      dy: 100,
      dx: 100
    }
  ]

  const makeAnnotations = annotation()
    .annotations(annotations)
  d3.select("#example1")
    .append("g")
    .call(makeAnnotations)

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
        <g className="annotation-group">
          {annotations}
        </g>
    </svg>
  );
};

const makeGraph = () => {
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
    .domain([0, max(data, xValue)])
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

const makeAnnotations = () => {
  const annotations = [{
    note: { label: "Steve Jobs Returns",     
      orientation: "top"},
    subject: {
      y1: mapMargin.top,
      y2: height - mapMargin.bottom
    },
    y: mapMargin.top,
    data: { x: "7/9/1997"},
    type: AnnotationXYThreshold
  },
  {
    note: { label: "iPod Release",
      orientation: "top"},
    subject: {
      y1: mapMargin.top,
      y2: height - mapMargin.bottom
    },
    y: mapMargin.top,
    data: { x: "10/23/2001"},
    type: AnnotationXYThreshold
  }].map(a => {
    const Annotation = a.type
    const { note, subject, y, dx, data } = a 
    note.wrap = 30
    note.lineType = null
    note.align = "middle"
    return <Annotation
      x={x(new Date(data.x))}
      y={data.y && y(data.y) || y}
      dx={dx}
      note={note}
      subject={subject}
    />
  })
};
const rootElement = document.getElementById('root');
ReactDOM.render(
  <div>
    <App/>
  </div>, rootElement
);

