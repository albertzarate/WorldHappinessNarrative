export const BarMarks = ({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  tooltipFormat
}) =>
  data.map(d => (
    <rect
      className="mark"
      key={yValue(d)}
      x={0}
      y={yScale(yValue(d))}
      width={xScale(xValue(d))}
      height={yScale.bandwidth()}
    >
      <title>"Score: "+{tooltipFormat(xValue(d))}</title>
    </rect>
  ));
