// URL: https://observablehq.com/@randomfractals/chicago-speed-camera-violations
// Title: Chicago Speed Camera Violations
// Author: Taras Novak (@randomfractals)
// Version: 371
// Runtime version: 1

const m0 = {
  id: "f32d773c0bb63336@371",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Speed Camera Violations

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation)/[Speed Camera Violations](https://data.cityofchicago.org/Transportation/Speed-Camera-Violations/hhkd-xvj4)
`
)})
    },
    {
      name: "map",
      inputs: ["DOM","width","L","geoData"],
      value: (function*(DOM,width,L,geoData)
{
  // create map container
  let mapContainer = DOM.element('div', { style: `width:${width}px;height:${width/1.6}px` });
  yield mapContainer;

  // create leaflet map with attributions
  let map = L.map(mapContainer).setView([41.85, -87.68], 10); // Chicago origins
  let osmLayer = L.tileLayer( // 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}@2x.png')
    'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; <a href=\"http://cartodb.com/attributions\">CartoDB</a>',
    detectRetina: false,
    maxZoom: 18,
    minZoom: 10,
    noWrap: false,
    subdomains: 'abc'
  }).addTo(map);

  // red dot marker
  const marker = {
    radius: 6,
    fillColor: "#ff4e3b",
    color: "#ff0000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  // map markers
  const pointToLayer = function (feature, latlng) {
    return L.circleMarker(latlng, marker);
  }

  // add markers
  let geoLayer = L.geoJson(geoData, {
    pointToLayer: pointToLayer,
    onEachFeature: function (feature, layer) {
      const data = feature.properties;
      const html = `<div class="popup"><h3>${data.address}</h3>
          <p>${data.count.toLocaleString()} violations</p>
        </div>`;
      layer.bindPopup(html);
      layer.bindTooltip(`${data.address} <br /> ${data.count.toLocaleString()} violations`, {sticky: true});
    }
  });

  map.addLayer(geoLayer);
  // map.fitBounds(markers.getBounds());
}
)
    },
    {
      name: "markerStyles",
      inputs: ["html"],
      value: (function(html){return(
html`
<style type="text/css">
  div.popup p {
    margin: 4px 0;
    font-size: 14px;
  }
</style>`
)})
    },
    {
      name: "viewof year",
      inputs: ["Inputs","years"],
      value: (function(Inputs,years){return(
Inputs.select(years, {value: 2022, label: 'Select Year:', format: year => year})
)})
    },
    {
      name: "year",
      inputs: ["Generators","viewof year"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Top 10 (Busy) Chicago Speed Cameras`
)})
    },
    {
      name: "top10CamerasPlot",
      inputs: ["Plot","top10Cameras"],
      value: (function(Plot,top10Cameras){return(
Plot.plot({
  height: top10Cameras.length * 40,
  marginLeft: 150,
  x: {
    tickFormat: "%",
    domain: [0, 1],
    grid: true
  },
  marks: [
    Plot.frame(),
    Plot.barX(top10Cameras, {
      x: "percent",
      y: "address",
      fill: "#ff4e3b",
      title: d => `${d.count.toLocaleString()} violations`
    }),
    Plot.text(top10Cameras, {
      x: "percent",
      y: "address",
      text: d => Math.floor(d.percent * 100) + "%",
      dx: 10
    })
  ]
})
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Recorded Chicago Speed Camera Violations by Day`
)})
    },
    {
      name: "dayPlot",
      inputs: ["Plot","violationsByDate","d3"],
      value: (function(Plot,violationsByDate,d3){return(
Plot.plot({
  height: 180,
  x: {
    axis: null,
    padding: 0,
  },
  y: {
    padding: 0,
    tickFormat: Plot.formatWeekday("en", "narrow"),
    tickSize: 0
  },
  fy: {
    reverse: true
  },
  facet: {
    data: violationsByDate,
    y: d => d.date.getUTCFullYear()
  },
  marks: [
    Plot.cell(violationsByDate, {
      x: d => d3.utcWeek.count(d3.utcYear(d.date), d.date),
      y: d => d.date.getUTCDay(),
      fill: 'count',
      title: d => `${d.date.toLocaleDateString()}: ${d.count.toLocaleString()} violations`,
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
  sort: 'violations',
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
md`### Violations by Camera`
)})
    },
    {
      name: "viewof violationsSummaryView",
      inputs: ["Inputs","violationsByCamera"],
      value: (function(Inputs,violationsByCamera){return(
Inputs.table(violationsByCamera, {
  sort: 'count',
  reverse: true
})
)})
    },
    {
      name: "violationsSummaryView",
      inputs: ["Generators","viewof violationsSummaryView"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof camera",
      inputs: ["Inputs","cameraNames","html"],
      value: (function(Inputs,cameraNames,html){return(
Inputs.select(cameraNames, {label: html`<b>Select Camera:</b>`})
)})
    },
    {
      name: "camera",
      inputs: ["Generators","viewof camera"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof violationsByCameraView",
      inputs: ["Inputs","data","camera","columns"],
      value: (function(Inputs,data,camera,columns){return(
Inputs.table(data.filter(d => d.address == camera), {
  columns: columns,
  sort: 'violation_date',
  reverse: true
})
)})
    },
    {
      name: "violationsByCameraView",
      inputs: ["Generators","viewof violationsByCameraView"],
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
[2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
)})
    },
    {
      name: "columns",
      value: (function(){return(
[
  'address',
  'camera_id',
  'violations',
  'violation_date',
  'latitude',
  'longitude'
]
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/hhkd-xvj4.json'
)})
    },
    {
      name: "query",
      inputs: ["year"],
      value: (function(year){return(
`?$limit=50000&$where=violation_date between '${year}-01-01T00:00:00' and '${year}-12-31T23:59:59'`
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
    date: d => op.parse_date(d.violation_date)
  })
  .orderby('camera_id')
)})
    },
    {
      name: "violationsByDate",
      inputs: ["dataTable","op"],
      value: (function(dataTable,op){return(
dataTable.groupby('date')
  .rollup({
    count: d => op.sum(d.violations)
  })
)})
    },
    {
      name: "violationsByCamera",
      inputs: ["dataTable","op","cameraTable","aq"],
      value: (function(dataTable,op,cameraTable,aq){return(
dataTable.groupby('address')
  .rollup({
    count: d => op.sum(d.violations)
  })
  .join(cameraTable)
  .orderby(aq.desc('count'))
)})
    },
    {
      name: "violationsByCameraRate",
      inputs: ["violationsByCamera","op","aq"],
      value: (function(violationsByCamera,op,aq){return(
violationsByCamera
  .select('address', 'count')
  .derive({
    percent: d => d.count / op.sum(d.count)
  })
  .orderby(aq.desc('percent'))
)})
    },
    {
      name: "top10Cameras",
      inputs: ["violationsByCameraRate"],
      value: (function(violationsByCameraRate){return(
violationsByCameraRate.objects().slice(0, 10)
)})
    },
    {
      name: "cameraNames",
      inputs: ["violationsByCamera"],
      value: (function(violationsByCamera){return(
violationsByCamera.array('address')
)})
    },
    {
      name: "geoData",
      inputs: ["getGeoDataPoints","violationsByCamera"],
      value: (function(getGeoDataPoints,violationsByCamera){return(
getGeoDataPoints(violationsByCamera.objects())
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Speed Camera Data`
)})
    },
    {
      name: "cameraLocationDataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/4i42-qv3h.json'
)})
    },
    {
      name: "cameraLocations",
      inputs: ["cameraLocationDataUrl"],
      value: (async function(cameraLocationDataUrl){return(
await fetch(cameraLocationDataUrl).then(data => data.json())
)})
    },
    {
      name: "cameras",
      inputs: ["cameraLocations"],
      value: (function(cameraLocations){return(
cameraLocations.map(camera => {
  camera.address = camera.address.toUpperCase().replace('(SPEED CAMERA)', '').trim();
  return camera;
})
)})
    },
    {
      name: "cameraTable",
      inputs: ["aq","cameras"],
      value: (function(aq,cameras){return(
aq.from(cameras)
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
      name: "leafletStyles",
      inputs: ["html","resolve"],
      value: (function(html,resolve){return(
html`<link href='${resolve('leaflet@1.7.1/dist/leaflet.css')}' rel='stylesheet' />`
)})
    },
    {
      name: "L",
      inputs: ["require"],
      value: (function(require){return(
require('leaflet@1.7.1')
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
  id: "f32d773c0bb63336@371",
  modules: [m0,m1,m2]
};

export default notebook;
