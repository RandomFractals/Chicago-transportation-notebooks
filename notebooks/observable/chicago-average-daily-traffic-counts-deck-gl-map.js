// URL: https://observablehq.com/@randomfractals/chicago-average-daily-traffic-counts-deck-gl-map
// Title: Chicago Average Daily Traffic Counts Deck.gl Map
// Author: Taras Novak (@randomfractals)
// Version: 332
// Runtime version: 1

const m0 = {
  id: "f01a9780696e22e1@332",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Average Daily Traffic Counts Deck.gl Map

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation) / [Average Daily Traffic Counts](https://dev.socrata.com/foundry/data.cityofchicago.org/pf56-35rv)

Chicago Data Portal: [Average Daily Traffic Counts Map](https://data.cityofchicago.org/Transportation/Average-Daily-Traffic-Counts-Map/pf56-35rv)
`
)})
    },
    {
      name: "mapContainer",
      inputs: ["html","width","data"],
      value: (function(html,width,data){return(
html `<div style="height:${width*.6}px">
  <div class="data-panel">
    <b>${data.length.toLocaleString()}</b> Traffic Counters
  </div>
  <div id="tooltip"></div>
</div>`
)})
    },
    {
      name: "heaxagonLayer",
      inputs: ["deck","colorRange","data","lightSettings","onHover","deckgl"],
      value: (function(deck,colorRange,data,lightSettings,onHover,deckgl)
{
  const hexagonLayer = new deck.HexagonLayer({
    id: 'heatmap',
    colorRange,
    data: data,
    elevationRange: [0, 1000],
    elevationScale: data && data.length ? 20 : 0,
    extruded: true,
    getPosition: d => [Number(d.longitude), Number(d.latitude)],
    opacity: .1,
    radius: 100,
    coverage: 0.9,
    upperPercentile: 95,
    lightSettings,
    pickable: true,
    autoHighlight: true,
    onHover: onHover,
    transitions: {
      elevationScale: 1000
    },
    material: {
      ambient: 0.64,
      diffuse: 0.6,
      shininess: 32,
      specularColor: [51, 51, 51]
    }
  });
  
  deckgl.setProps({layers: [hexagonLayer]});
  return hexagonLayer;
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Data`
)})
    },
    {
      name: "viewof tableView",
      inputs: ["Inputs","data","columns"],
      value: (function(Inputs,data,columns){return(
Inputs.table(data, {
  columns: columns,
  reverse: true
})
)})
    },
    {
      name: "tableView",
      inputs: ["Generators","viewof tableView"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Data Queries and Filters`
)})
    },
    {
      name: "columns",
      value: (function(){return(
[
  'id',
  'date_of_count',
  'traffic_volume_count_location_address',
  'street',
  'total_passing_vehicle_volume',
  'vehicle_volume_by_each_direction_of_traffic',
  'latitude',
  'longitude'
]
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/pf56-35rv.json'
)})
    },
    {
      name: "query",
      value: (function(){return(
`?$limit=100000`
)})
    },
    {
      name: "data",
      inputs: ["dataUrl","query"],
      value: (async function(dataUrl,query){return(
await fetch(dataUrl + query).then(data => data.json())
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Map Elements and Styles`
)})
    },
    {
      name: "deckgl",
      inputs: ["deck","mapContainer","mapboxgl"],
      value: (function(deck,mapContainer,mapboxgl)
{
  return new deck.DeckGL({
    container: mapContainer,
    map: mapboxgl,
    mapboxAccessToken: '',
    mapboxApiAccessToken: 'pk.eyJ1IjoiZGF0YXBpeHkiLCJhIjoiY2tnM3ZhZWJjMDE1ajJxbGY1eTNlemduciJ9.YZ9CJEza0hvAQmTRBhubmQ',
    mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    initialViewState: {
      latitude: 41.82,
      longitude: -87.65,
      zoom: 10,
      minZoom: 8,
      maxZoom: 15,
      pitch: 30,
      bearing: 0
    },
    controller: true
  });
}
)
    },
    {
      name: "colorRange",
      value: (function()
{
  return [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
  ];
}
)
    },
    {
      name: "lightSettings",
      value: (function()
{
  return {
    lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
    ambientRatio: 0.4,
    diffuseRatio: 0.6,
    specularRatio: 0.2,
    lightsStrength: [0.8, 0.0, 0.8, 0.0],
    numberOfLights: 2
  };
}
)
    },
    {
      name: "tooltip",
      inputs: ["mapContainer"],
      value: (function(mapContainer){return(
mapContainer.querySelector('#tooltip')
)})
    },
    {
      name: "onHover",
      inputs: ["tooltip"],
      value: (function(tooltip){return(
function onHover (info) {
  const pointsObject = info.object;
  if (pointsObject && pointsObject.points && pointsObject.points.length > 0) {
    const data = pointsObject.points[0].source;
    const dateTime = data.date_of_count.split('T');
    const trafficDirectionVolume = data.vehicle_volume_by_each_direction_of_traffic.split('/');
    tooltip.style.left = `${info.x}px`;
    tooltip.style.top = `${info.y}px`;
    tooltip.innerHTML = `<b>${data.traffic_volume_count_location_address} ${data.street}</b><br />
      Vehicle Volume: <b>${Number(data.total_passing_vehicle_volume).toLocaleString()}</b><br />
      ${trafficDirectionVolume[0]}<br />
      ${trafficDirectionVolume[1]}<br />
      Recorded on: <b>${new Date(dateTime[0]).toLocaleDateString()}</b>`;
  } else { 
    tooltip.innerHTML = '';
  }
}
)})
    },
    {
      inputs: ["html"],
      value: (function(html){return(
html`<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.3.0/mapbox-gl.css' rel='stylesheet' />
mapbox-gl.css`
)})
    },
    {
      name: "tooltipStyle",
      inputs: ["html"],
      value: (function(html){return(
html `
<style>
#tooltip:empty {
  display: none;
}
#tooltip {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12px;
  position: absolute;
  padding: 4px;
  margin: 8px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  max-width: 300px;
  z-index: 9;
  pointer-events: none;
}
</style>
`
)})
    },
    {
      name: "dataPanelStyle",
      inputs: ["html"],
      value: (function(html){return(
html `
<style type="text/css">
.data-panel {
  position: absolute;
  top: 0;
  font-family: Nunito, sans-serif;
  font-size: 12px;
  background-color: #f6f6f6;
  padding: 8px;
  border-radius: 3px;
  box-shadow: 1px 2px 4px #888;
  z-index: 10;
}
</style>
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Imports`
)})
    },
    {
      name: "mapboxgl",
      inputs: ["require"],
      value: (function(require){return(
require('mapbox-gl@^2.3.0/dist/mapbox-gl.js')
)})
    },
    {
      name: "deck",
      inputs: ["require"],
      value: (function(require){return(
require.alias({
  // optional dependencies
  h3: {},
  s2Geometry: {}
})('deck.gl@^8.4.17/dist.min.js')
)})
    }
  ]
};

const notebook = {
  id: "f01a9780696e22e1@332",
  modules: [m0]
};

export default notebook;
