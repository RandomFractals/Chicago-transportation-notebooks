// URL: https://observablehq.com/@randomfractals/chicago-traffic-crashes-deck-gl-heatmap
// Title: Chicago Traffic Crashes Deck.gl Heatmap
// Author: Taras Novak (@randomfractals)
// Version: 304
// Runtime version: 1

const m0 = {
  id: "8e714c7629d49907@304",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Traffic Crashes Deck.gl Heatmap

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation) / [Traffic Crashes](https://data.cityofchicago.org/Transportation/Traffic-Crashes-Crashes/85ca-t3if)
`
)})
    },
    {
      name: "mapContainer",
      inputs: ["html","width","data","year"],
      value: (function(html,width,data,year){return(
html `<div style="height:${width*.6}px">
  <div class="data-panel">
    <b>${data.length.toLocaleString()}</b> crashes in <b>${year}</b>
    <div class="data-list"></div>
  </div>
  <div id="tooltip"></div>
</div>`
)})
    },
    {
      name: "heaxagonLayer",
      inputs: ["deck","colorRange","data","lightSettings","onHover","onClick","deckgl"],
      value: (function(deck,colorRange,data,lightSettings,onHover,onClick,deckgl)
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
    onClick: onClick,
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
      name: "viewof year",
      inputs: ["Inputs","years"],
      value: (function(Inputs,years){return(
Inputs.select(years, {value: 2021, label: 'Select Year:', format: year => year})
)})
    },
    {
      name: "year",
      inputs: ["Generators","viewof year"],
      value: (G, _) => G.input(_)
    },
    {
      name: "dayPlot",
      inputs: ["Plot","crashesByDate","d3"],
      value: (function(Plot,crashesByDate,d3){return(
Plot.plot({
  height: 180,
  x: {
    axis: null,
    padding: 0,
  },
  y: {
    padding: 0,
    tickFormat: Plot.formatWeekday('en', 'narrow'),
    tickSize: 0
  },
  fy: {
    reverse: true
  },
  facet: {
    data: crashesByDate,
    y: d => d.date.getUTCFullYear()
  },
  marks: [
    Plot.cell(crashesByDate, {
      x: d => d3.utcWeek.count(d3.utcYear(d.date), d.date),
      y: d => d.date.getUTCDay(),
      fill: 'count',
      title: d => `${d.date.toLocaleDateString()}: ${d.count.toLocaleString()} crashes`,
      inset: 0.5
    })
  ]
})
)})
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
      name: "years",
      value: (function(){return(
[2020, 2021]
)})
    },
    {
      name: "columns",
      value: (function(){return(
[
  'crash_date',
  'crash_type',
  'posted_speed_limit',
  'weather_condition',
  'lighting_condition',
  'first_crash_type',
  'trafficway_type',
  'alignment',
  'roadway_sourface_cond',
  'road_defect',
  'report_type',
  'private_property',
  'hit_and_run_i',
  'damage',
  'date_police_notified',
  'prim_contributory_cause',
  'sec_contributory_cause',
  'street_no',
  'street_direction',
  'street_name',
  'beat_of_occurrence',
  'photos_taken_i',
  'num_units',
  'most_severe_injury',
  'injuries_total',
  'injuries_fatal',
  'injuries_incapacitating',
  'injuries_reported_not_evident',
  'injuries_no_indication',
  'injuries_unknown',
  'crash_hour',
  'crash_day_of_week',
  'crash_month',
  'latitude',
  'longitude'
]
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/85ca-t3if.json'
)})
    },
    {
      name: "query",
      inputs: ["year"],
      value: (function(year){return(
`?$limit=100000&$where=crash_date between '${year}-01-01T00:00:00' and '${year}-12-31T23:59:59'`
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
      name: "dataTable",
      inputs: ["aq","data","op"],
      value: (function(aq,data,op){return(
aq.from(data)
  .derive({
    date_time: d => op.parse_date(d.crash_date)
  })
  .spread({crash_date: d => op.split(d.crash_date, 'T')}, {as: ['date', 'time']})
  .orderby('posted_speed_limit')
)})
    },
    {
      name: "crashesByDate",
      inputs: ["dataTable","op"],
      value: (function(dataTable,op){return(
dataTable.groupby('date').count()
  .derive({
    date: d => op.parse_date(d.date)
  })
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
  const {x, y, object} = info;
  if (object) {
    tooltip.style.left = `${x}px`;    
    tooltip.style.top = `${y}px`;
    tooltip.innerHTML = `${object.points.length} crash reports`;
  } else { 
    tooltip.innerHTML = '';
  }
}
)})
    },
    {
      name: "dataList",
      inputs: ["mapContainer"],
      value: (function(mapContainer){return(
mapContainer.querySelector('.data-list')
)})
    },
    {
      name: "onClick",
      inputs: ["dataList"],
      value: (function(dataList){return(
function onClick(info) {
  const mapPoints = info.object.points;
  const dataPoints = mapPoints;
  dataList.innerHTML = dataPoints.reduce((html, d) => {
      const data = d.source;
      const dateTime = data.crash_date.split('T');
      return html + 
        `<hr class="data-item"><b>${data.street_no} ${data.street_direction} ${data.street_name}</b><br />
        at <b>${dateTime[1].replace('.000', '')}</b>
        on <b>${dateTime[0]}</b><br />
        ${data.crash_type}<br />
        ${data.prim_contributory_cause}<br />
        <b>${data.damage} damage</b><br /></hr>`;
    }, '');
}
)})
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
  font-size: 11px;
  position: absolute;
  padding: 4px;
  margin: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  max-width: 300px;
  font-size: 10px;
  z-index: 9;
  pointer-events: none;
}
</style>
`
)})
    },
    {
      name: "dataPanelStyle",
      inputs: ["html","width"],
      value: (function(html,width){return(
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
.data-list {
  max-height: ${width*.6 - 100}px;
  width: 270px;
  overflow: auto;
}
.data-item {
  padding: 10px;
  margin: 0px;
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
      from: "@uwdata/arquero",
      name: "aq",
      remote: "aq"
    },
    {
      from: "@uwdata/arquero",
      name: "op",
      remote: "op"
    },
    {
      from: "@randomfractals/geo-data-utils",
      name: "getGeoDataPoints",
      remote: "getGeoDataPoints"
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

const m1 = {
  id: "@uwdata/arquero",
  variables: [
    {
      name: "aq",
      inputs: ["require","aq_version","aq_packages","toView"],
      value: (async function(require,aq_version,aq_packages,toView)
{
  const aq = await require(`arquero@${aq_version}`);

  // load and install any additional packages
  (await Promise.all(aq_packages.map(pkg => require(pkg))))
    .forEach(pkg => aq.addPackage(pkg));

  // Add HTML table view method to tables
  aq.addTableMethod('view', toView, { override: true });

  return aq;
}
)
    },
    {
      name: "op",
      inputs: ["aq"],
      value: (function(aq){return(
aq.op
)})
    },
    {
      name: "aq_version",
      value: (function(){return(
'4.8.4'
)})
    },
    {
      name: "aq_packages",
      value: (function(){return(
[]
)})
    },
    {
      name: "toView",
      inputs: ["html"],
      value: (function(html)
{
  const DEFAULT_LIMIT = 100;
  const DEFAULT_NULL = value => `<span style="color: #999;">${value}</span>`;
  const tableStyle = 'margin: 0; border-collapse: collapse; width: initial;';
  const cellStyle = 'padding: 1px 5px; white-space: nowrap; overflow-x: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums;';

  // extend table prototype to provide an HTML table view
  return function(dt, opt = {}) {
    // permit shorthand for limit
    if (typeof opt === 'number') opt = { limit: opt };
    
    // marshal cell color options
    const color = { ...opt.color };
    if (typeof opt.color === 'function') {
      // if function, apply to all columns
      dt.columnNames().forEach(name => color[name] = opt.color);
    } else {
      // otherwise, gather per-column color options
      for (const key in color) {
        const value = color[key];
        color[key] = typeof value === 'function' ? value : () => value;
      }
    }

    // marshal CSS styles as toHTML() options
    const table = `${tableStyle}`;
    const td = (name, index, row) => {
      return `${cellStyle} max-width: ${+opt.maxCellWidth || 300}px;`
        + (color[name] ? ` background-color: ${color[name](index, row)};` : '');
    };

    opt = {
      limit: DEFAULT_LIMIT,
      null: DEFAULT_NULL,
      ...opt,
      style: { table, td, th: td }
    };

    // return container div, bind table value to support viewof operator
    const size = `max-height: ${+opt.height || 270}px`;
    const style = `${size}; overflow-x: auto; overflow-y: auto;`;
    const view = html`<div style="${style}">${dt.toHTML(opt)}</div>`;
    view.value = dt;
    return view;
  };
}
)
    }
  ]
};

const m2 = {
  id: "@randomfractals/geo-data-utils",
  variables: [
    {
      name: "getGeoDataPoints",
      value: (function(){return(
function getGeoDataPoints(data) {
  const geoData = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
      }
    },
    features: []
  }
  const features = data.filter(point => (point.longitude && point.latitude)).map(dataPoint => {
    const feature = {
      type: 'Feature',
      properties: dataPoint,
      geometry: {
        type: 'Point',
        coordinates: [dataPoint.longitude, dataPoint.latitude]
      }
    };
    return feature;
  });
  geoData.features = features;
  return geoData;
}
)})
    }
  ]
};

const notebook = {
  id: "8e714c7629d49907@304",
  modules: [m0,m1,m2]
};

export default notebook;
