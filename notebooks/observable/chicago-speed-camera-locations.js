// URL: https://observablehq.com/@randomfractals/chicago-speed-camera-locations
// Title: Chicago Speed Camera Locations
// Author: Taras Novak (@randomfractals)
// Version: 123
// Runtime version: 1

const m0 = {
  id: "647160e91b2cec8d@123",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Speed Camera Locations

**Data Source:** [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation)/[Speed Camera Locations](https://data.cityofchicago.org/Transportation/Speed-Camera-Locations/4i42-qv3h)`
)})
    },
    {
      name: "map",
      inputs: ["DOM","width","L","markerCluster","geoData"],
      value: (function*(DOM,width,L,markerCluster,geoData)
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

  // add markers
  let markers = markerCluster({});
  let geoLayer = L.geoJson(geoData, {
    onEachFeature: function (feature, layer) {
      const data = feature.properties;
      const html = `<div class="popup"><h2>${data.address}</h2>
          <p>live since ${data.go_live_date}</p>
          <p>first approach: ${data.first_approach}</p>
          <p>second approach: ${data.second_approach}</p>
        </div>`;
      layer.bindPopup(html);
      layer.bindTooltip(`${data.address} <br /> live since ${data.go_live_date}`, {sticky: true});
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
      inputs: ["md","data"],
      value: (function(md,data){return(
md`## Data

There are **${data.length}** speed cameras in Chicago area.

### Speed Camera Locations
`
)})
    },
    {
      name: "viewof dataTable",
      inputs: ["Inputs","data","columns"],
      value: (function(Inputs,data,columns){return(
Inputs.table(data, {
  columns: columns
})
)})
    },
    {
      name: "dataTable",
      inputs: ["Generators","viewof dataTable"],
      value: (G, _) => G.input(_)
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/4i42-qv3h.json'
)})
    },
    {
      name: "columns",
      value: (function(){return(
[
  'address',
  'go_live_date',
  'first_approach',
  'second_approach',
  'latitude',
  'longitude'
]
)})
    },
    {
      name: "data",
      inputs: ["dataUrl"],
      value: (async function(dataUrl){return(
await fetch(dataUrl).then(data => data.json())
)})
    },
    {
      name: "geoData",
      inputs: ["getGeoDataPoints","data"],
      value: (function(getGeoDataPoints,data){return(
getGeoDataPoints(data)
)})
    },
    {
      from: "@randomfractals/geo-data-utils",
      name: "getGeoDataPoints",
      remote: "getGeoDataPoints"
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Leaftlet Imports`
)})
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
  id: "647160e91b2cec8d@123",
  modules: [m0,m1]
};

export default notebook;
