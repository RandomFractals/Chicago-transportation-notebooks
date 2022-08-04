// URL: https://observablehq.com/@randomfractals/chicago-traffic-tracker
// Title: Chicago Traffic Tracker
// Author: Taras Novak (@randomfractals)
// Version: 151
// Runtime version: 1

const m0 = {
  id: "5d009b86321f06fb@151",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Traffic Tracker

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation) / [Chicago Traffic Tracker - Congestion Estimates by Segments](https://data.cityofchicago.org/Transportation/Chicago-Traffic-Tracker-Congestion-Estimates-by-Se/n4j6-wkkf)

Chicago Data Portal: [Chicago Traffic Tracker - Congestion Estimates by Segments Data](https://data.cityofchicago.org/Transportation/Chicago-Traffic-Tracker-Congestion-Estimates-by-Se/n4j6-wkkf/data)
`
)})
    },
    {
      name: "mapContainer",
      inputs: ["html","width","dataTable"],
      value: (function(html,width,dataTable){return(
html `<div style="height:${width*.6 - 50}px">
  <div class="data-panel">
    <b>${dataTable.size.toLocaleString()}</b> Traffic Segments
  </div>
  <div id="tooltip"></div>
</div>`
)})
    },
    {
      name: "speedLegend",
      inputs: ["html"],
      value: (function(html){return(
html `
<div id="legend">
  <style>
    #legend {
      display: flex;
      font-family: Helvetica, Arial, sans-serif;
      font-size: 14px;
    }
    b {
      vertical-align: center;
      position: relative;
      height: 30px;
    }
    svg {
      margin: 0 15px;
    }
  </style>
  <b>0 mph</b>
  <svg height="20" width="300">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
        <stop offset="33%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(0,255,0);stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad1)" />
  </svg>
  <b>60 mph</b>
</div>
`
)})
    },
    {
      name: "trafficSegmentsLayer",
      inputs: ["deck","dataTable","colorScale","onHover","deckgl"],
      value: (function(deck,dataTable,colorScale,onHover,deckgl)
{
  const segmentsLayer = new deck.LineLayer({
    id: 'trafficSegments',
    data: dataTable.objects(),
    opacity: 0.8,
    pickable: true,
    getWidth: 8,
    getColor: d => colorScale(Number(d.current_speed)),
    getSourcePosition: d => [Number(d.start_longitude), Number(d.start_latitude)],
    getTargetPosition: d => [Number(d.end_longitude), Number(d.end_latitude)],
    onHover: onHover
  });

  deckgl.setProps({layers: [segmentsLayer]});
  return segmentsLayer;
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
      name: "viewof searchResults",
      inputs: ["Inputs","dataTable"],
      value: (function(Inputs,dataTable){return(
Inputs.search(dataTable)
)})
    },
    {
      name: "searchResults",
      inputs: ["Generators","viewof searchResults"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof tableView",
      inputs: ["Inputs","searchResults","columns"],
      value: (function(Inputs,searchResults,columns){return(
Inputs.table(searchResults, {
  columns,
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
  'segment_id',
  'from_street',
  'to_street',
  'street_heading',
  'street',
  'direction',
  'segment_length',
  'current_speed',
  'start_longitude',
  'start_latitude',
  'end_longitude',
  'end_latitude',
  'last_updated',
  'update_date_time'
]
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/n4j6-wkkf.json'
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
      name: "dataTable",
      inputs: ["aq","data","op"],
      value: (function(aq,data,op){return(
aq.from(data)
  .filter(d => d._traffic >= 0)
  .rename({
    segmentid: 'segment_id',
    _direction: 'direction',
    _fromst: 'from_street',
    _tost: 'to_street',
    _length: 'segment_length',
    _strheading: 'street_heading',
    _traffic: 'current_speed',
    start_lon: 'start_longitude',
    _lif_lat: 'start_latitude',
    _lit_lon: 'end_longitude',
    _lit_lat: 'end_latitude',
    _last_updt: 'last_updated'
  })
  .derive({
    update_date_time: d => op.parse_date(d.last_updated)
  })
  .orderby('current_speed')
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
    mapStyle: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    initialViewState: {
      latitude: 41.82,
      longitude: -87.65,
      zoom: 10,
      minZoom: 8,
      maxZoom: 15,
      pitch: 0,
      bearing: 0
    },
    controller: true
  });
}
)
    },
    {
      name: "colorScale",
      inputs: ["linearSpeedScale"],
      value: (function(linearSpeedScale){return(
(n) => {
  let color = linearSpeedScale(n)
  color = color.split(',')
  color[0] = Number(color[0].substring(4, color[0].length))
  color[1] = Number(color[1].substring(1, color[1].length))
  color[2] = Number(color[2].substring(1, color[2].length-1))
  return color
}
)})
    },
    {
      name: "linearSpeedScale",
      inputs: ["d3"],
      value: (function(d3){return(
d3.scaleLinear()
  .domain([-1, 20, 60])
  .range(['red', 'yellow', 'green'])
)})
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
  const data = info.object;
  if (data) {
    tooltip.style.left = `${info.x}px`;
    tooltip.style.top = `${info.y}px`;
    tooltip.innerHTML = `<b>${data.direction}</b> from <b>${data.from_street}</b> to <b>${data.to_street}</b>
      on <b>${data.street_heading} ${data.street}</b> street<br />
      esitmated <b>${Number(data.current_speed).toLocaleString()} mph</b> speed
      for <b>${data.segment_length}</b> miles<br />
      last updated on <b>${data.update_date_time.toLocaleDateString()}</b>
      at <b>${data.update_date_time.toLocaleTimeString()}</b>`;
  } else {
    tooltip.innerHTML = '';
  }
}
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
      inputs: ["html"],
      value: (function(html){return(
html`<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.3.0/mapbox-gl.css' rel='stylesheet' />
mapbox-gl.css`
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
'5.0.0'
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

const notebook = {
  id: "5d009b86321f06fb@151",
  modules: [m0,m1]
};

export default notebook;
