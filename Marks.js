import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3';

const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();

const missingDataColor = 'lightgray';

export const Marks = ({
  worldAtlas: { countries, interiors },
  rowByNumericCode,
  colorScale,
  colorValue
}) => (
  <g className="marks">
    <path className="sphere" d={path({ type: 'Sphere' })} />
    <path className="graticules" d={path(graticule())} />
    {countries.features.map(feature => {
      const d = rowByNumericCode.get(feature.id);
      if(!d){
        console.log(feature.properties.name);
      }
      return (
        <path
          fill={d ? colorScale(colorValue(d)) : missingDataColor}
          d={path(feature)}>
        </path>
      );
    })}
    <path className="interiors" d={path(interiors)} />
  </g>
);
