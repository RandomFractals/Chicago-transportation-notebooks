// URL: https://observablehq.com/@randomfractals/chicago-taxi-trips-deck-gl-map
// Title: Chicago Taxi Trips Deck.gl Map
// Author: Taras Novak (@randomfractals)
// Version: 335
// Runtime version: 1

const m0 = {
  id: "4090a7cad3ce156d@335",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Taxi Trips Deck.gl Map

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation) / [Taxi Trips](https://data.cityofchicago.org/Transportation/Taxi-Trips/wrvz-psew)

Trips Map Info: https://deck.gl/examples/trips-layer/
`
)})
    },
    {
      inputs: ["md","geoDataTable","geoTrips"],
      value: (function(md,geoDataTable,geoTrips){return(
md`## ${geoDataTable.totalRows().toLocaleString()} geo located trips | ${geoTrips.totalRows().toLocaleString()} unique routes`
)})
    },
    {
      name: "viewof tripDate",
      inputs: ["date","year"],
      value: (function(date,year){return(
date({
  title: year, 
  min: `2013-01-01`,
  max: `${year}-12-31`,
  value: `2021-05-31`,
  description: `Select Trips Date`
})
)})
    },
    {
      name: "tripDate",
      inputs: ["Generators","viewof tripDate"],
      value: (G, _) => G.input(_)
    },
    {
      name: "mapContainer",
      inputs: ["html","width","geoDataTable"],
      value: (function(html,width,geoDataTable){return(
html `<div style="height:${width*.9 - 50}px">
  <div class="data-panel">
    <b>${geoDataTable.size.toLocaleString()}</b> Traffic Segments
  </div>
  <div id="tooltip"></div>
</div>`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`TODO: add trips layer`
)})
    },
    {
      name: "trafficPathsLayer",
      inputs: ["deck","tripPaths"],
      value: (function(deck,tripPaths)
{
  const tripPathsLayer = new deck.PathLayer({
    id: 'tripPathsLayer',
    data: tripPaths.objects(),
    opacity: 0.2,
    pickable: true,
    widthScale: 20,
    widthMinPixels: 2,
    getColor: d => d.color,
    getPath: d => d.path
  });
  // deckgl.setProps({layers: [tripPathsLayer]});
  return tripPathsLayer;
}
)
    },
    {
      inputs: ["md","data"],
      value: (function(md,data){return(
md`## Trip Data (${data.length.toLocaleString()} trips)`
)})
    },
    {
      name: "viewof tableView",
      inputs: ["Inputs","data","columns"],
      value: (function(Inputs,data,columns){return(
Inputs.table(data, {
  columns: columns,
  reverse: false
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
md`## Trip Data Queries and Filters`
)})
    },
    {
      name: "year",
      value: (function(){return(
new Date().getFullYear()
)})
    },
    {
      name: "columns",
      value: (function(){return(
[
  'trip_start_timestamp',
  'trip_end_timestamp',
  'trip_seconds',
  'trip_miles',
  'pickup_community_area',
  'dropoff_community_area',
  'fare',
  'tips',
  'tolls',
  'extras',
  'trip_total',
  'payment_type',
  'company',
  'pickup_centroid_latitude',
  'pickup_centroid_longitude',
  'dropoff_centroid_latitude',
  'dropoff_centroid_longitude',
  'trip_id',
  'taxi_id'
]
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/wrvz-psew.json'
)})
    },
    {
      name: "query",
      inputs: ["tripDate"],
      value: (function(tripDate){return(
`?$limit=15000&$where=trip_start_timestamp between '${tripDate}T00:00:00' and '${tripDate}T23:59:59'`
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
      name: "geoDataTable",
      inputs: ["aq","data","op"],
      value: (function(aq,data,op){return(
aq.from(
    data.filter(d => d.trip_miles >= 0 &&
      d['pickup_centroid_latitude'] &&
      d['pickup_centroid_longitude'] &&
      d['dropoff_centroid_latitude'] &&
      d['dropoff_centroid_longitude'])
  )
  .derive({
    trip_start_time: d => op.parse_date(d.trip_start_timestamp),
    trip_end_time: d => op.parse_date(d.trip_end_timestamp)
  })
  .orderby('trip_start_time')
)})
    },
    {
      name: "tripStartLocations",
      inputs: ["geoDataTable"],
      value: (function(geoDataTable){return(
geoDataTable.select('pickup_centroid_latitude', 'pickup_centroid_longitude')
  .rename({
    pickup_centroid_latitude: 'latitude', 
    pickup_centroid_longitude: 'longitude'
  })
  .groupby('latitude', 'longitude')
)})
    },
    {
      name: "tripEndLocations",
      inputs: ["geoDataTable"],
      value: (function(geoDataTable){return(
geoDataTable.select('dropoff_centroid_latitude', 'dropoff_centroid_longitude')
  .rename({
    dropoff_centroid_latitude: 'latitude', 
    dropoff_centroid_longitude: 'longitude'
  })
  .groupby('latitude', 'longitude')
)})
    },
    {
      name: "geoLocations",
      inputs: ["tripStartLocations","tripEndLocations"],
      value: (function(tripStartLocations,tripEndLocations){return(
tripStartLocations.union(tripEndLocations)
)})
    },
    {
      name: "tripRoutes",
      inputs: ["geoDataTable"],
      value: (function(geoDataTable){return(
geoDataTable.select(
    'pickup_centroid_latitude', 
    'pickup_centroid_longitude',
    'dropoff_centroid_latitude', 
    'dropoff_centroid_longitude'
  )
  .rename({
    pickup_centroid_latitude: 'start_latitude',
    pickup_centroid_longitude: 'start_longitude',
    dropoff_centroid_latitude: 'end_latitude',
    dropoff_centroid_longitude: 'end_longitude',    
  })
)})
    },
    {
      name: "startEndGeoTrips",
      inputs: ["tripRoutes"],
      value: (function(tripRoutes){return(
tripRoutes.union(tripRoutes)
)})
    },
    {
      name: "reversedGeoTrips",
      inputs: ["startEndGeoTrips"],
      value: (function(startEndGeoTrips){return(
startEndGeoTrips
  .rename({
    end_latitude: 'start_latitude',
    end_longitude: 'start_longitude',
    start_latitude: 'end_latitude',
    start_longitude: 'end_longitude',    
  })
)})
    },
    {
      name: "geoTrips",
      inputs: ["startEndGeoTrips","reversedGeoTrips"],
      value: (function(startEndGeoTrips,reversedGeoTrips){return(
startEndGeoTrips.join(reversedGeoTrips)
)})
    },
    {
      name: "tripWaypoints",
      inputs: ["geoTrips"],
      value: (function(geoTrips){return(
geoTrips.derive({
  turn_latitude: d => d.start_latitude,
  turn_longitude: d => d.end_longitude
})
)})
    },
    {
      name: "tripPaths",
      inputs: ["tripWaypoints","op"],
      value: (function(tripWaypoints,op){return(
tripWaypoints.derive({
  path: d=> [[op.parse_float(d.start_longitude), op.parse_float(d.start_latitude)], 
             [op.parse_float(d.turn_longitude), op.parse_float(d.turn_latitude)], 
             [op.parse_float(d.end_longitude), op.parse_float(d.end_latitude)]],
  color: [0, 124, 0]
})
)})
    },
    {
      name: "tripsByCompany",
      inputs: ["geoDataTable","aq"],
      value: (function(geoDataTable,aq){return(
geoDataTable.groupby('company').count().orderby(aq.desc('count'))
)})
    },
    {
      name: "tripsByStartTime",
      inputs: ["geoDataTable"],
      value: (function(geoDataTable){return(
geoDataTable.groupby('trip_start_time').count()
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
      latitude: 41.88,
      longitude: -87.65,
      zoom: 13,
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
      from: "@jashkenas/inputs",
      name: "date",
      remote: "date"
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
  id: "@jashkenas/inputs",
  variables: [
    {
      name: "date",
      inputs: ["input"],
      value: (function(input){return(
function date(config = {}) {
  const { min, max, value, title, description, disabled, display } =
    typeof config === "string" ? { value: config } : config;
  return input({
    type: "date",
    title,
    description,
    display,
    attributes: { min, max, disabled, value }
  });
}
)})
    },
    {
      name: "input",
      inputs: ["html","d3format"],
      value: (function(html,d3format){return(
function input(config) {
  let {
    form,
    type = "text",
    attributes = {},
    action,
    getValue,
    title,
    description,
    format,
    display,
    submit,
    options
  } = config;
  const wrapper = html`<div></div>`;
  if (!form)
    form = html`<form>
	<input name=input type=${type} />
  </form>`;
  Object.keys(attributes).forEach(key => {
    const val = attributes[key];
    if (val != null) form.input.setAttribute(key, val);
  });
  if (submit)
    form.append(
      html`<input name=submit type=submit style="margin: 0 0.75em" value="${
        typeof submit == "string" ? submit : "Submit"
      }" />`
    );
  form.append(
    html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
  );
  if (title)
    form.prepend(
      html`<div style="font: 700 0.9rem sans-serif; margin-bottom: 3px;">${title}</div>`
    );
  if (description)
    form.append(
      html`<div style="font-size: 0.85rem; font-style: italic; margin-top: 3px;">${description}</div>`
    );
  if (format)
    format = typeof format === "function" ? format : d3format.format(format);
  if (action) {
    action(form);
  } else {
    const verb = submit
      ? "onsubmit"
      : type == "button"
      ? "onclick"
      : type == "checkbox" || type == "radio"
      ? "onchange"
      : "oninput";
    form[verb] = e => {
      e && e.preventDefault();
      const value = getValue ? getValue(form.input) : form.input.value;
      if (form.output) {
        const out = display ? display(value) : format ? format(value) : value;
        if (out instanceof window.Element) {
          while (form.output.hasChildNodes()) {
            form.output.removeChild(form.output.lastChild);
          }
          form.output.append(out);
        } else {
          form.output.value = out;
        }
      }
      form.value = value;
      if (verb !== "oninput")
        form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
    };
    if (verb !== "oninput")
      wrapper.oninput = e => e && e.stopPropagation() && e.preventDefault();
    if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
    form[verb]();
  }
  while (form.childNodes.length) {
    wrapper.appendChild(form.childNodes[0]);
  }
  form.append(wrapper);
  return form;
}
)})
    },
    {
      name: "d3format",
      inputs: ["require"],
      value: (function(require){return(
require("d3-format@1")
)})
    }
  ]
};

const m2 = {
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

const notebook = {
  id: "4090a7cad3ce156d@335",
  modules: [m0,m1,m2]
};

export default notebook;
