// URL: https://observablehq.com/@randomfractals/chicago-taxi-trips
// Title: Chicago Taxi Trips
// Author: Taras Novak (@randomfractals)
// Version: 177
// Runtime version: 1

const m0 = {
  id: "db00010d81235f7b@177",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Taxi Trips

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation) / [Taxi Trips](https://data.cityofchicago.org/Transportation/Taxi-Trips/wrvz-psew)

`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Trip Date`
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
  description: `Select Trip Date`
})
)})
    },
    {
      name: "tripDate",
      inputs: ["Generators","viewof tripDate"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Serviced by Company`
)})
    },
    {
      name: "tripsByCompanyPlot",
      inputs: ["vl","tripsByCompany"],
      value: (function(vl,tripsByCompany){return(
vl.markBar()
  .data(tripsByCompany)
  .encode(
    vl.x().fieldO('company').axis({title: 'Company', labelAngle: 30}),
    vl.y().fieldQ('count').axis({title: 'Count'}),
    vl.tooltip().fieldN('count')
  )
  .height(200)
  .render()
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Trip Payments`
)})
    },
    {
      name: "paymentTypePlot",
      inputs: ["vl","tripsByPaymentType","width"],
      value: (function(vl,tripsByPaymentType,width){return(
vl.markBar().data(tripsByPaymentType).encode(
  vl.y().fieldO('payment_type').sort({encoding: 'x'}).axis({title: 'Type'}),
  vl.x().fieldQ('count').axis({title: 'Count'}),
  vl.tooltip().fieldN('count')
).width(width - 200).render()
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Trips by Start Time (every 15 minutes)`
)})
    },
    {
      name: "tripStartTimePlot",
      inputs: ["Plot","width","tripsByStartTime"],
      value: (function(Plot,width,tripsByStartTime){return(
Plot.plot({
  width: width,
  height: 320,
  x: {
    label: 'time',
    tickFormat: ''
  },
  marks: [
    Plot.barY(tripsByStartTime, {
      x: 'trip_start_time', 
      y: 'count', 
      fill: 'steelblue',
      title: d => `${d.trip_start_time.toLocaleTimeString()}: ${d.count.toLocaleString()} trips`
    })
  ]
})
)})
    },
    {
      inputs: ["md","geoDataTable"],
      value: (function(md,geoDataTable){return(
md`## Trip Geo Data Summary (${geoDataTable.totalRows().toLocaleString()} geo located trips)`
)})
    },
    {
      name: "viewof geoDataSummaryView",
      inputs: ["SummaryTable","geoDataTable"],
      value: (function(SummaryTable,geoDataTable){return(
SummaryTable(geoDataTable.objects(), {label: 'Taxi Trips Data'})
)})
    },
    {
      name: "geoDataSummaryView",
      inputs: ["Generators","viewof geoDataSummaryView"],
      value: (G, _) => G.input(_)
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
      name: "dataTable",
      inputs: ["aq","data","op"],
      value: (function(aq,data,op){return(
aq.from(data)
  .derive({
    trip_start_time: d => op.parse_date(d.trip_start_timestamp),
    trip_end_time: d => op.parse_date(d.trip_end_timestamp)
  })
  .orderby('trip_start_time')
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
      name: "tripsByCompany",
      inputs: ["dataTable","aq"],
      value: (function(dataTable,aq){return(
dataTable.groupby('company').count().orderby(aq.desc('count'))
)})
    },
    {
      name: "tripsByPaymentType",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.groupby('payment_type').count()
)})
    },
    {
      name: "tripsByStartTime",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.groupby('trip_start_time').count()
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
      from: "@observablehq/summary-table",
      name: "SummaryTable",
      remote: "SummaryTable"
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

const m3 = {
  id: "@observablehq/summary-table",
  variables: [
    {
      name: "SummaryTable",
      inputs: ["SummaryCard","htl","width","SummarizeColumn"],
      value: (function(SummaryCard,htl,width,SummarizeColumn){return(
(data, {label="Summary"} = {}) => {
  const sample = data[0] || {};
  const cols = data.columns || Object.keys(sample);
  let value = []

  // Create the summary card and track data shape
  const summaryCard = SummaryCard(data, label)
  value.n_rows = summaryCard.value.n_rows
  value.n_columns = summaryCard.value.n_columns
  value.columns = cols

  // Compose the element
  const element = htl.html`<div style="display:inline-block; vertical-align:top;">${summaryCard}</div>
      <div style="display:inline-block;">
        <table style="vertical-align:middle; display:block; overflow-x:auto; max-width:${width}px;">
          <thead style="z-index:-999;">
          <th>Column</th>
          <th style="min-width:250px">Snapshot</th>
          <th>Missing</th>
          <th>Mean</th>
          <th>Median</th>
          <th>SD</th>
        </thead>
      ${cols.map(d => {
        const ele = SummarizeColumn(data, d)       
        value.push(ele.value) // get the value from the element
        return ele
      })}
    </table>
  </div>`  
  element.value = value;
  return element
}
)})
    },
    {
      name: "SummaryCard",
      inputs: ["getType","addTooltips","Plot","colorMap","htl","d3"],
      value: (function(getType,addTooltips,Plot,colorMap,htl,d3){return(
(data, label = "Summary") => {  
  // Compute values
  const sample = data[0] || {};
  const cols = data.columns || Object.keys(sample);
  const col_data = cols.map(d => {
    return {
      label:d === "" ? "unlabeled" : d, 
      type:getType(data, d)
    }
  })
  const n_columns = col_data.length;
  const n_rows = data.length;
  
  // Create the header row as a plot
  const header_plot = addTooltips(
    Plot.cellX(col_data, 
      {fill:d => colorMap.get(d.type).color, title: d => `${d.label}\n(${d.type})`}
    ).plot({
       x:{axis:null}, 
       width:100, 
       height:10, 
       color:{
         domain:[...colorMap.values()].map(d => d.color)
       }, 
       style:{
         overflow:"visible"
       }
    }), 
    {stroke:"black", "stroke-width":"3px"}
  )
  
  // Create the columns as a plot
  const col_plot = Plot.cellX(col_data, {fill:d => colorMap.get(d.type).color, fillOpacity:.3}).plot({
    x:{axis:null}, 
    width:100, height:80, 
    color:{
       domain:[...colorMap.values()].map(d => d.color)
    }}
  )
  
  // Construct the element
  const arrow_styles = {display: "inline-block",
                        verticalAlign: "top",
                        transformOrigin: "0 0",
                        transform: "rotate(90deg)",
                        marginTop: "20px",
                        position:"absolute",
                        left: "114px",
                        top: "54px"}
  
  const ele = htl.html`<div style="font-family:sans-serif; font-size:13px; margin-right:10px;">
      <span style="font-size:1.3em">${label}</span>
      <div>${d3.format(",.0f")(n_columns)} ⟶</div>
      ${header_plot}
      <span style="display:inline-block">${col_plot}</span>
      <span style="display:inline-block; vertical-align:top;">${d3.format(",.0f")(n_rows)}<br/></span>
      <span style=${arrow_styles}>⟶</span>
    </div>`   
  
  ele.value = {n_rows, n_columns};
  return ele 
}
)})
    },
    {
      name: "SummarizeColumn",
      inputs: ["getType","htl","icon_fns","d3","SmallStack","pct_format","Histogram","html"],
      value: (function(getType,htl,icon_fns,d3,SmallStack,pct_format,Histogram,html){return(
(data, col) => {
  
  let content, value, format, el, chart, missing_label, pct_missing, min, max, median, mean, sd;
  
  // Construct content based on type  
  const type = getType(data, col)
  
  const col1 = htl.html`<td style="white-space: nowrap;vertical-align:middle;padding-right:5px;padding-left:3px;">${icon_fns[type]()}<strong style="vertical-align:middle;">${col === "" ? "unlabeled" : col}</strong></td>`
  
  switch(type) {
      // Categorical columns
    case 'ordinal': 
      format = d3.format(",.0f") 
      
      // Calculate category percent and count
      const categories = d3.rollups(
          data, 
          v => ({count:v.length, pct:v.length / data.length || 1}), 
          d => d[col]
        ).sort((a, b) => b[1].count - a[1].count)
        .map(d => {
          let obj = {}
          obj[col] = (d[0] === null || d[0] === "") ? "(missing)" : d[0]
          obj.count = d[1].count
          obj.pct = d[1].pct
          return obj
      })
      
      // Calculate pct. missing        
      pct_missing = data.filter(d => d[col] === null).length / data.length
      
      // Create the chart
      const stack_chart = SmallStack(categories, col)          
      
      // element to return
      el = htl.html`<tr style="font-family:sans-serif;font-size:13px;">
        ${col1}          
        <td><div style="position:relative;">${stack_chart}</div></td>
        <td>${pct_format(pct_missing)}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
      </tr>`;
      
      value = {column: col, type, min:null, max: null, mean: null, median: null,
               sd: null, missing:pct_missing, n_categories:categories.length}
      break;
      
      // Date columns
    case "date": 
      // Calculate and format start / end      
      const start = d3.min(data, d => +d[col])
      const end = d3.max(data, d => +d[col])               
      mean = d3.mean(data, d => +d[col]);
      median = d3.median(data, d => +d[col]);
      sd = d3.deviation(data, d => +d[col]);
      
      // Calculate pct. missing         
      pct_missing = data.filter(d => d[col] === null).length / data.length      
      chart = Histogram(data, col, type)
      
      // Element to return
      el = htl.html`<tr style="font-family:sans-serif;font-size:13px;">
          ${col1}
          <td><div style="position:relative;">${chart}</div></td>
          <td>${pct_format(pct_missing)}</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>` 
      value = {column: col, type, min:start, max: end, mean: null, median: null, 
               sd: null, missing:pct_missing, n_categories:null}
      break;
      
      // Continuous columns
    default: 
      // Compute values 
      format = d3.format(",.0f")
      min = d3.min(data, d => +d[col])
      max = d3.max(data, d => +d[col])
      mean = d3.mean(data, d => +d[col])
      median = d3.median(data, d => +d[col])
      sd = d3.deviation(data, d => +d[col])
      pct_missing = data.filter(d => d[col] === null).length / data.length
      
      chart = Histogram(data, col, type)
      // Element to return
      el = htl.html`<tr style="font-family:sans-serif;font-size:13px;">
          ${col1}
          <td><div style="position:relative;top:3px;">${chart}</div></td>
          <td>${pct_format(pct_missing)}</td>
          <td>${format(mean)}</td>
          <td>${format(median)}</td>
          <td>${format(sd)}</td>
        </tr>` 
      
      value = {column: col, type, min, max, mean, median, sd, missing:pct_missing, n_categories:null}
      break;
  }  
  el.value = value;
  el.appendChild(html`<style>td {vertical-align:middle;} </style>`)
  return el
}
)})
    },
    {
      name: "getType",
      value: (function(){return(
(data, column) => {
  for (const d of data) {
    const value = d[column];
    if (value == null) continue;
    if (typeof value === "number") return "continuous";
    if (value instanceof Date) return "date";
    return "ordinal"
  }
  // if all are null, return ordinal
  return "ordinal"
}
)})
    },
    {
      from: "@mkfreeman/plot-tooltip",
      name: "addTooltips",
      remote: "addTooltips"
    },
    {
      name: "colorMap",
      inputs: ["d3","_"],
      value: (function(d3,_){return(
new Map([["ordinal","rgba(78, 121, 167, 1)"],
 ["continuous", "rgba(242, 142, 44, 1)"],
 ["date", "rgba(225,87,89, 1)"]
].map(d => {
  const col = d3.color(d[1])
  const color_copy = _.clone(col)
  color_copy.opacity = .6
  return [d[0], {color:col.formatRgb(), brighter:color_copy.formatRgb()}]
}))
)})
    },
    {
      name: "icon_fns",
      inputs: ["html","colorMap"],
      value: (function(html,colorMap){return(
{
  ordinal:() => html`<div style="display:inline-block; border-radius:100%; width: 16px; height: 16px; background-color: ${colorMap.get("ordinal").color}; transform: scale(1.3); vertical-align: middle; align-items: center;margin-right:8px;}">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="2" height="2" fill="white"/>
    <rect x="7" y="4" width="6" height="2" fill="white"/>
    <rect x="4" y="7" width="2" height="2" fill="white"/>
    <rect x="7" y="7" width="6" height="2" fill="white"/>
    <rect x="4" y="10" width="2" height="2" fill="white"/>
    <rect x="7" y="10" width="6" height="2" fill="white"/>
  </svg>
</div>`,
  date: () => html`<div style="display:inline-block; border-radius:100%; width: 16px; height: 16px; background-color: ${colorMap.get("date").color}; transform: scale(1.3); vertical-align: middle; align-items: center;margin-right:8px;}">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="5" width="8" height="1" fill="white"/>
    <rect x="5" y="4" width="2" height="1" fill="white"/>
    <rect x="9" y="4" width="2" height="1" fill="white"/>
    <rect x="4" y="7" width="8" height="5" fill="white"/>
  </svg>
</div>`,
  continuous:() => html`<div style="display:inline-block; border-radius:100%; width: 16px; height: 16px; background-color: ${colorMap.get("continuous").color}; transform: scale(1.3); vertical-align: middle; align-items: center;margin-right:8px;}">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="4" height="2" transform="rotate(-90 4 12)" fill="white"/>
    <rect x="7" y="12" width="6" height="2" transform="rotate(-90 7 12)" fill="white"/>
    <rect x="10" y="12" width="8" height="2" transform="rotate(-90 10 12)" fill="white"/>
  </svg>
</div>`
}
)})
    },
    {
      name: "SmallStack",
      inputs: ["addTooltips","Plot","pct_format","d3"],
      value: (function(addTooltips,Plot,pct_format,d3){return(
(categoryData, col) => {
  // Get a horizontal stacked bar
  const label = categoryData.length === 1 ? " category" : " categories"
  return addTooltips(
    Plot.barX(categoryData, {x:"count", fill:col, y:0, title: d => d[col] + "\n" + pct_format(d.pct)}).plot({
      color:{scheme:"blues"}, 
      marks:[
        Plot.text([0,0], {x:0, dy:13, text:d => d3.format(",.0f")(categoryData.length) + `${label}`})
      ], 
      style:{
        paddingTop:0,
        paddingBottom:15, 
        textAnchor:"start", 
        overflow:"visible"    
      }, 
      x:{axis:null},
      color:{
        domain:categoryData.map(d => d[col]), 
        scheme:"blues", 
        reverse: true
      },
      height:30, 
      width:205,
      y:{
        axis:null, 
        range:[30, 3]
      }, 
      }
    ), {fill:"darkblue"})
}
)})
    },
    {
      name: "pct_format",
      inputs: ["d3"],
      value: (function(d3){return(
d3.format(".1%")
)})
    },
    {
      name: "Histogram",
      inputs: ["colorMap","d3","addTooltips","Plot"],
      value: (function(colorMap,d3,addTooltips,Plot){return(
(data, col, type = "continuous") => {
  // Compute color + mean
  const barColor = colorMap.get(type).brighter
  const mean = d3.mean(data, d => d[col])
  
  // Formatter for the mean
  const format = type === "date" ? d3.utcFormat("%m/%d/%Y"):d3.format(",.0f") 
  const rules = [{label:"mean", value:mean}] 
  return addTooltips(
    Plot.plot({
      height:55, 
      width:240, 
      style:{
        display:"inline-block"
      },
      x:{
        label:"",
        ticks:[d3.min(data, d => d[col]), d3.max(data, d => d[col])],
        tickFormat:format
      }, 
      y:{
        axis:null
      },     
      marks:[
        Plot.rectY(data, Plot.binX({y:"count", title: (elems) => {
          // compute range for the elements
          const extent = d3.extent(elems, d => d[col]);
          return `${elems.length} rows\n[${format(extent[0])} to ${format(extent[1])}]`}
          }, {x:col, fill: barColor})
        ), 
        Plot.ruleY([0]), 
        Plot.ruleX(rules, {x:"value", strokeWidth:2, title:d => `${d.label} ${col}: ${format(d.value)}` })
      ], 
      style:{
        marginLeft:-17,
        background:"none",      
        overflow: "visible" 
      }
    }), {opacity:1, fill:colorMap.get(type).color})
}
)})
    }
  ]
};

const m4 = {
  id: "@mkfreeman/plot-tooltip",
  variables: [
    {
      name: "addTooltips",
      inputs: ["d3","id_generator","hover","html"],
      value: (function(d3,id_generator,hover,html){return(
(chart, hover_styles = { fill: "blue", opacity: 0.5 }) => {
  // Add the hover g

  // Workaround if it's in a figure
  const type = d3.select(chart).node().tagName;
  const wrapper =
    type === "FIGURE" ? d3.select(chart).select("svg") : d3.select(chart);

  const tip = wrapper
    .selectAll(".hover-tip")
    .data([""])
    .join("g")
    .attr("class", "hover")
    .style("pointer-events", "none")
    .style("text-anchor", "middle");

  // Add a unique id to the chart for styling
  const id = id_generator();

  // Add the event listeners
  d3.select(chart)
    .classed(id, true) // using a class selector so that it doesn't overwrite the ID
    .selectAll("title")
    .each(function () {
      // Get the text out of the title, set it as an attribute on the parent, and remove it
      const title = d3.select(this); // title element that we want to remove
      const parent = d3.select(this.parentNode); // visual mark on the screen
      const t = title.text();
      if (t) {
        parent.attr("__title", t).classed("has-title", true);
        title.remove();
      }
      // Mouse events
      parent
        .on("mousemove", function (event) {
          const text = d3.select(this).attr("__title");
          const pointer = d3.pointer(event, wrapper.node());
          if (text) tip.call(hover, pointer, text.split("\n"));
          else tip.selectAll("*").remove();
        })
        .on("mouseout", (event) => {
          tip.selectAll("*").remove();
        });
    });

  // Remove the tip if you tap on the wrapper (for mobile)
  wrapper.on("touchstart", () => tip.selectAll("*").remove());
  // Add styles
  const style_string = Object.keys(hover_styles)
    .map((d) => {
      return `${d}:${hover_styles[d]};`;
    })
    .join("");

  // Define the styles
  const style = html`<style>
      .${id} .has-title {
       cursor: pointer; 
       pointer-events: all;
      }
      .${id} .has-title:hover {
        ${style_string}
    }
    </style>`;
  chart.appendChild(style);
  return chart;
}
)})
    },
    {
      name: "id_generator",
      value: (function(){return(
() => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return "a" + S4() + S4();
}
)})
    },
    {
      name: "hover",
      value: (function(){return(
(tip, pos, text) => {
  const side_padding = 10;
  const vertical_padding = 5;
  const vertical_offset = 15;

  // Empty it out
  tip.selectAll("*").remove();

  // Append the text
  tip
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("transform", `translate(${pos[0]}, ${pos[1] + 7})`)
    .selectAll("text")
    .data(text)
    .join("text")
    .style("dominant-baseline", "ideographic")
    .text((d) => d)
    .attr("y", (d, i) => (i - (text.length - 1)) * 15 - vertical_offset)
    .style("font-weight", (d, i) => (i === 0 ? "bold" : "normal"));

  const bbox = tip.node().getBBox();

  // Add a rectangle (as background)
  tip
    .append("rect")
    .attr("y", bbox.y - vertical_padding)
    .attr("x", bbox.x - side_padding)
    .attr("width", bbox.width + side_padding * 2)
    .attr("height", bbox.height + vertical_padding * 2)
    .style("fill", "white")
    .style("stroke", "#d3d3d3")
    .lower();
}
)})
    }
  ]
};

const notebook = {
  id: "db00010d81235f7b@177",
  modules: [m0,m1,m2,m3,m4]
};

export default notebook;
