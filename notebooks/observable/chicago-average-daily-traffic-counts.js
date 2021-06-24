// URL: https://observablehq.com/@randomfractals/chicago-average-daily-traffic-counts
// Title: Chicago Average Daily Traffic Counts
// Author: Taras Novak (@randomfractals)
// Version: 159
// Runtime version: 1

const m0 = {
  id: "3c6a1ee56e29e7ef@159",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Average Daily Traffic Counts

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation) / [Average Daily Traffic Counts](https://dev.socrata.com/foundry/data.cityofchicago.org/pf56-35rv)

Chicago Data Portal: [Average Daily Traffic Counts Map](https://data.cityofchicago.org/Transportation/Average-Daily-Traffic-Counts-Map/pf56-35rv)
`
)})
    },
    {
      name: "map",
      inputs: ["DOM","width","L","geoData","heatLayer","markerCluster"],
      value: (function*(DOM,width,L,geoData,heatLayer,markerCluster)
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

  // create hit points for the heatmap layer
  let hitPoints = geoData.features.map(feature => 
    feature.geometry.coordinates.slice().reverse().concat([0.1])); // intensity
  
  // add heat layer
  let heatmapLayer = heatLayer(hitPoints, {
    minOpacity: 0.12,
    maxZoom: 18,
    max: 1.0,
    radius: 8,
    blur: 5,
    gradient: null
  }).addTo(map);
  
  // dot marker
  const marker = {
    radius: 6,
    fillColor: "steelblue",
    color: "#0000ff",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };
  
  // map markers
  const pointToLayer = function (feature, latlng) {
    return L.circleMarker(latlng, marker);
  }
  
  // add markers
  let markers = markerCluster({});
  let geoLayer = L.geoJson(geoData, {
    pointToLayer: pointToLayer,    
    onEachFeature: function (feature, layer) {
      const data = feature.properties;
      const html = `<div class="popup">
          <h3>${data.traffic_volume_count_location_address} ${data.street}</h3>
          <p>Vehicle Volume: ${data.total_passing_vehicle_volume.toLocaleString()}</p>
          <p>${data.vehicle_volume_by_each_direction_of_traffic}</p>
          <p>Recorded on: ${data.date.toLocaleDateString()}</p>
        </div>`;
      layer.bindPopup(html);
      layer.bindTooltip(`${data.traffic_volume_count_location_address}  ${data.street} <br />
        Vehicle Volume: ${data.total_passing_vehicle_volume.toLocaleString()}`, {sticky: true});
    }
  });  
  
  markers.addLayer(geoLayer);
  map.addLayer(markers);
  
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
      name: "geoData",
      inputs: ["getGeoDataPoints","dataTable"],
      value: (function(getGeoDataPoints,dataTable){return(
getGeoDataPoints(dataTable.objects())
)})
    },
    {
      name: "dataTable",
      inputs: ["aq","data","op"],
      value: (function(aq,data,op){return(
aq.from(data)
  .derive({
    date: d => op.parse_date(d.date_of_count)
  })
  .orderby('total_passing_vehicle_volume')
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
    },
    {
      name: "heatLayer",
      inputs: ["L","require"],
      value: (function(L,require){return(
L, require('leaflet.heat').catch(() =>  L.heatLayer)
)})
    },
    {
      name: "markerClusterStyles",
      inputs: ["html","resolve"],
      value: (function(html,resolve){return(
html`<link href='${resolve('leaflet.markercluster@1.2.0/dist/MarkerCluster.Default.css')}' rel='stylesheet' />`
)})
    },
    {
      name: "markerCluster",
      inputs: ["L","require"],
      value: (function(L,require){return(
L, require('leaflet.markercluster@1.2.0').catch(() => L.markerClusterGroup)
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
  id: "3c6a1ee56e29e7ef@159",
  modules: [m0,m1,m2]
};

export default notebook;
