import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const MapChart = (props) => {
  if (!props.long || !props.lat) {
    props.long = 8.01427
    props.lat = 47.00016
  }
    
  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill="#DDD"
              stroke="#FFF"
            />
          ))
        }
      </Geographies>
      <Marker coordinates={[props.long, props.lat]}>
        <circle r={2} fill="#F53" />
      </Marker>
    </ComposableMap>
  );
};

export default MapChart;