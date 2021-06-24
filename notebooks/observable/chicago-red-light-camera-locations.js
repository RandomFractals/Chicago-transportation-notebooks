// URL: https://observablehq.com/@randomfractals/chicago-red-light-camera-locations
// Title: Chicago Red Light Camera Locations
// Author: Taras Novak (@randomfractals)
// Version: 135
// Runtime version: 1

const m0 = {
  id: "7141acfc66c182df@135",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Red Light Camera Locations

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation)/[Red Light Camera Locations](https://data.cityofchicago.org/Transportation/Red-Light-Camera-Locations/thvf-6diy)`
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
      const html = `<div class="popup"><h2>${data.intersection}</h2>
          <p>live since ${new Date(data.go_live_date).toLocaleDateString()}</p>
          <p>first approach: ${data.first_approach}</p>
          <p>second approach: ${data.second_approach}</p>
        </div>`;
      layer.bindPopup(html);
      layer.bindTooltip(`${data.intersection} <br />
        live since ${new Date(data.go_live_date).toLocaleDateString()}`, {sticky: true});
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
      inputs: ["md"],
      value: (function(md){return(
md`## Data`
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
'https://data.cityofchicago.org/resource/thvf-6diy.json'
)})
    },
    {
      name: "columns",
      value: (function(){return(
[
  'intersection',
  'go_live_date',
  'first_approach',
  'second_approach',
  'third_approach',
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
  id: "7141acfc66c182df@135",
  modules: [m0,m1]
};

export default notebook;
