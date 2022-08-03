// URL: https://observablehq.com/@randomfractals/chicago-towed-vehicles-summary
// Title: Chicago Towed Vehicles Summary
// Author: Taras Novak (@randomfractals)
// Version: 161
// Runtime version: 1

const m0 = {
  id: "d93908fb8a708e49@161",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Towed Vehicles Summary

Information about the vehicles that have been towed and impounded by the City of Chicago within the last 90 days.

**Data Source:** [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation) / [Towed Vehicles](https://data.cityofchicago.org/Transportation/Towed-Vehicles/ygr5-vcbg)
`
)})
    },
    {
      inputs: ["md","data"],
      value: (function(md,data){return(
md`## Towed Vehicles in the last 90 days

Total: **${data.length.toLocaleString()}**
`
)})
    },
    {
      inputs: ["Plot","width","towByDate"],
      value: (function(Plot,width,towByDate){return(
Plot.plot({
  width: width,
  height: 200,
  padding: 0,
  x: {
    axis: 'top',
    label: 'Month Day'
  },
  y: {
    label: 'Month',
    tickFormat: Plot.formatMonth('en', 'short')
  },
  color: {
    scheme: 'BuYlRd'
  },
  marks: [
    Plot.cell(towByDate, {
      x: d => d.date.getUTCDate(),
      y: d => d.date.getUTCMonth(),
      fill: 'count',
      inset: 0.5
    }),
    Plot.text(towByDate, {
        x: d => d.date.getUTCDate(),
        y: d => d.date.getUTCMonth(),
        text: d => d.count
      }
    )
  ]
})
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Towed Vehicles by Make, Style, and Color`
)})
    },
    {
      name: "towedMakePlot",
      inputs: ["vl","towByMake"],
      value: (function(vl,towByMake){return(
vl.markBar()
  .data(towByMake)
  .encode(
    vl.x().fieldO('make').axis({labelAngle: 60}),
    vl.y().fieldQ('count'),
    vl.tooltip().fieldN('count')
  )
  .height(200)
  .render()
)})
    },
    {
      name: "towedStylePlot",
      inputs: ["vl","towByStyle"],
      value: (function(vl,towByStyle){return(
vl.markBar()
  .data(towByStyle)
  .encode(
    vl.x().fieldO('style').axis({labelAngle: 60}),
    vl.y().fieldQ('count'),
    vl.tooltip().fieldN('count')
  )
  .height(200)
  .render()
)})
    },
    {
      name: "towedColorPlot",
      inputs: ["vl","towByColor"],
      value: (function(vl,towByColor){return(
vl.markBar()
  .data(towByColor)
  .encode(
    vl.x().fieldO('color').axis({labelAngle: 60}),
    vl.y().fieldQ('count'),
    vl.tooltip().fieldN('count')
  )
  .height(200)
  .render()
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Data

### Towed Vehicles by Make, Style and Color Counts
`
)})
    },
    {
      name: "viewof make",
      inputs: ["Inputs","towByMake"],
      value: (function(Inputs,towByMake){return(
Inputs.select(towByMake, {
  label: 'Vehicle Make',
  format: x => `${x.make} (${x.count})`,
  value: x => x.make
})
)})
    },
    {
      name: "make",
      inputs: ["Generators","viewof make"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof style",
      inputs: ["Inputs","towByStyle"],
      value: (function(Inputs,towByStyle){return(
Inputs.select(towByStyle, {
  label: 'Vehicle Style',
  format: x => `${x.style} (${x.count})`,
  value: x => x.style
})
)})
    },
    {
      name: "style",
      inputs: ["Generators","viewof style"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof color",
      inputs: ["Inputs","towByColor"],
      value: (function(Inputs,towByColor){return(
Inputs.select(towByColor, {
  label: 'Vehicle Color',
  format: x => `${x.color} (${x.count})`,
  value: x => x.color
})
)})
    },
    {
      name: "color",
      inputs: ["Generators","viewof color"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Data Summary`
)})
    },
    {
      name: "viewof dataSummaryView",
      inputs: ["SummaryTable","data"],
      value: (function(SummaryTable,data){return(
SummaryTable(data, {label: 'Towed Vehicles Data'})
)})
    },
    {
      name: "dataSummaryView",
      inputs: ["Generators","viewof dataSummaryView"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Towed Vehicles Data`
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
      inputs: ["Inputs","searchResults"],
      value: (function(Inputs,searchResults){return(
Inputs.table(searchResults, {
  sort: 'date',
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
      name: "year",
      value: (function(){return(
new Date().getFullYear()
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/ygr5-vcbg.json'
)})
    },
    {
      name: "query",
      inputs: ["year"],
      value: (function(year){return(
`?$limit=100000&$where=tow_date between '${year}-01-01T00:00:00' and '${year}-12-31T23:59:59'`
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
    date: d => op.parse_date(d.tow_date)
  })
)})
    },
    {
      name: "towByDate",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.groupby('date').count()
)})
    },
    {
      name: "towByMake",
      inputs: ["dataTable","aq"],
      value: (function(dataTable,aq){return(
dataTable.select('make').groupby('make').count().orderby(aq.desc('count'))
)})
    },
    {
      name: "towByStyle",
      inputs: ["dataTable","aq"],
      value: (function(dataTable,aq){return(
dataTable.select('style').groupby('style').count().orderby(aq.desc('count'))
)})
    },
    {
      name: "towByColor",
      inputs: ["dataTable","aq"],
      value: (function(dataTable,aq){return(
dataTable.select('color').groupby('color').count().orderby(aq.desc('count'))
)})
    },
    {
      name: "towByState",
      inputs: ["dataTable","aq"],
      value: (function(dataTable,aq){return(
dataTable.select('state').groupby('state').count().orderby(aq.desc('count'))
)})
    },
    {
      name: "towToAddress",
      inputs: ["dataTable","aq"],
      value: (function(dataTable,aq){return(
dataTable.select('towed_to_address').groupby('towed_to_address').count().orderby(aq.desc('count'))
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
      from: "@observablehq/summary-table",
      name: "SummaryTable",
      remote: "SummaryTable"
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
  id: "@observablehq/summary-table",
  variables: [
    {
      name: "SummaryTable",
      inputs: ["SummaryCard","htl","width","SummarizeColumn"],
      value: (function(SummaryCard,htl,width,SummarizeColumn){return(
(dataObj, {label="Summary"} = {}) => {
  const data = typeof dataObj.numRows === "function" ? dataObj.objects() :
    typeof dataObj.toArray === "function" ? dataObj.toArray().map((r) => Object.fromEntries(r)) :
    dataObj
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
      <div style="display:inline-block; max-width:${width < 500 ? width : width - 160}px">
        <table style="vertical-align:middle; display:block;overflow-x:auto; max-width:${width}px;">
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
      pct_missing = data.filter(d => (d[col] === null || d[col] === "")).length / data.length

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
      pct_missing = data.filter(d => d[col] === null || d[col] === "").length / data.length
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
      min = d3.min(data, d => +d[col])
      max = d3.max(data, d => +d[col])
      mean = d3.mean(data, d => +d[col])
      median = d3.median(data, d => +d[col])
      sd = d3.deviation(data, d => +d[col])
      format = d3.format(",." + d3.precisionFixed(sd / 10) + "f")
      pct_missing = data.filter(d => d[col] === null || isNaN(d[col])).length / data.length

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
      inputs: ["d3","addTooltips","Plot","pct_format"],
      value: (function(d3,addTooltips,Plot,pct_format){return(
(categoryData, col, maxCategories = 100) => {
  // Get a horizontal stacked bar
  const label = categoryData.length === 1 ? " category" : " categories";
  let chartData = categoryData;
  let categories = 0;
  if (chartData.length > maxCategories) {
    chartData = categoryData.filter((d, i) => i < maxCategories);
    const total = d3.sum(categoryData, (d) => d.count);
    const otherCount = total - d3.sum(chartData, (d) => d.count);
    let other = {};
    other[col] = "Other categories...";
    other.count = otherCount;
    other.pct = other.count / total;
    chartData.push(other);
  }

  return addTooltips(
    Plot.barX(chartData, {
      x: "count",
      fill: col,
      y: 0,
      title: (d) => d[col] + "\n" + pct_format(d.pct)
    }).plot({
      color: { scheme: "blues" },
      marks: [
        Plot.text([0, 0], {
          x: 0,
          dy: 13,
          text: (d) => d3.format(",.0f")(categoryData.length) + `${label}`
        })
      ],
      style: {
        paddingTop: "0px",
        paddingBottom: "15px",
        textAnchor: "start",
        overflow: "visible"
      },
      x: { axis: null },
      color: {
        domain: chartData.map((d) => d[col]),
        scheme: "blues",
        reverse: true
      },
      height: 30,
      width: 205,
      y: {
        axis: null,
        range: [30, 3]
      }
    }),
    { fill: "darkblue" }
  );
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
      inputs: ["colorMap","d3","getDateFormat","addTooltips","Plot"],
      value: (function(colorMap,d3,getDateFormat,addTooltips,Plot){return(
(data, col, type = "continuous") => {
  // Compute color + mean
  const barColor = colorMap.get(type).brighter;
  const mean = d3.mean(data, (d) => d[col]);

  // Formatter for the mean
  const extent = d3.extent(data, (d) => d[col]);
  const format = type === "date" ? getDateFormat(extent) :
    Math.floor(extent[0]) === Math.floor(extent[1]) ? d3.format(",.2f") : d3.format(",.0f");
  const rules = [{ label: "mean", value: mean }];
  return addTooltips(
    Plot.plot({
      height: 55,
      width: 240,
      style: {
        display: "inline-block"
      },
      x: {
        label: "",
        ticks: extent,
        tickFormat: format
      },
      y: {
        axis: null
      },
      marks: [
        Plot.rectY(
          data,
          Plot.binX(
            {
              y: "count",
              title: (elems) => {
                // compute range for the elements
                const [start, end] = d3.extent(elems, (d) => d[col]);
                let barFormat;
                if (type === "date") {
                  barFormat = getDateFormat([start, end]);
                } else {
                  barFormat = d3.format(
                    Math.floor(start) === Math.floor(end) ? ",.2f" : ",.0f"
                  );
                }
                return `${elems.length} rows\n[${barFormat(
                  start
                )} to ${barFormat(end)}]`;
              }
            },
            { x: col, fill: barColor }
          )
        ),
        Plot.ruleY([0]),
        Plot.ruleX(rules, {
          x: "value",
          strokeWidth: 2,
          title: (d) => `${d.label} ${col}: ${format(d.value)}`
        })
      ],
      style: {
        marginLeft: -17,
        background: "none",
        overflow: "visible"
      }
    }),
    { opacity: 1, fill: colorMap.get(type).color }
  );
}
)})
    },
    {
      name: "getDateFormat",
      inputs: ["d3"],
      value: (function(d3){return(
(extent) => {
  const formatMillisecond = d3.utcFormat(".%L"),
      formatSecond = d3.utcFormat(":%S"),
      formatMinute = d3.utcFormat("%I:%M"),
      formatHour = d3.utcFormat("%I %p"),
      formatDay = d3.utcFormat("%a %d"),
      formatWeek = d3.utcFormat("%b %d"),
      formatMonth = d3.utcFormat("%B"),
      formatYear = d3.utcFormat("%Y");

  // Test on the difference between the extent, offset by 1

  return extent[1] > d3.utcYear.offset(extent[0], 1)? formatYear :
    extent[1] > d3.utcMonth.offset(extent[0], 1)? formatMonth :
    extent[1] > d3.utcWeek.offset(extent[0], 1) ? formatWeek :
    extent[1] > d3.utcDay.offset(extent[0], 1) ? formatDay :
    extent[1] > d3.utcHour.offset(extent[0], 1) ? formatHour :
    extent[1] > d3.utcMinute.offset(extent[0], 1) ? formatMinute :
    extent[1] > d3.utcSecond.offset(extent[0], 1) ? formatSecond :
    extent[1] > d3.utcMillisecond.offset(extent[0], 1) ? formatMillisecond :
    formatDay
}
)})
    }
  ]
};

const m3 = {
  id: "@mkfreeman/plot-tooltip",
  variables: [
    {
      name: "addTooltips",
      inputs: ["d3","id_generator","hover","html"],
      value: (function(d3,id_generator,hover,html){return(
(chart, styles) => {
  const stroke_styles = { stroke: "blue", "stroke-width": 3 };
  const fill_styles = { fill: "blue", opacity: 0.5 };

  // Workaround if it's in a figure
  const type = d3.select(chart).node().tagName;
  let wrapper =
    type === "FIGURE" ? d3.select(chart).select("svg") : d3.select(chart);

  // Workaround if there's a legend....
  const svgs = d3.select(chart).selectAll("svg");
  if (svgs.size() > 1) wrapper = d3.select([...svgs].pop());
  wrapper.style("overflow", "visible"); // to avoid clipping at the edges

  // Set pointer events to visibleStroke if the fill is none (e.g., if its a line)
  wrapper.selectAll("path").each(function (data, index, nodes) {
    // For line charts, set the pointer events to be visible stroke
    if (
      d3.select(this).attr("fill") === null ||
      d3.select(this).attr("fill") === "none"
    ) {
      d3.select(this).style("pointer-events", "visibleStroke");
      if (styles === undefined) styles = stroke_styles;
    }
  });

  if (styles === undefined) styles = fill_styles;

  const tip = wrapper
    .selectAll(".hover")
    .data([1])
    .join("g")
    .attr("class", "hover")
    .style("pointer-events", "none")
    .style("text-anchor", "middle");

  // Add a unique id to the chart for styling
  const id = id_generator();

  // Add the event listeners
  d3.select(chart).classed(id, true); // using a class selector so that it doesn't overwrite the ID
  wrapper.selectAll("title").each(function () {
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
      .on("pointerenter pointermove", function (event) {
        const text = d3.select(this).attr("__title");
        const pointer = d3.pointer(event, wrapper.node());
        if (text) tip.call(hover, pointer, text.split("\n"));
        else tip.selectAll("*").remove();

        // Raise it
        d3.select(this).raise();
        // Keep within the parent horizontally
        const tipSize = tip.node().getBBox();
        if (pointer[0] + tipSize.x < 0)
          tip.attr(
            "transform",
            `translate(${tipSize.width / 2}, ${pointer[1] + 7})`
          );
        else if (pointer[0] + tipSize.width / 2 > wrapper.attr("width"))
          tip.attr(
            "transform",
            `translate(${wrapper.attr("width") - tipSize.width / 2}, ${
              pointer[1] + 7
            })`
          );
      })
      .on("pointerout", function (event) {
        tip.selectAll("*").remove();
        // Lower it!
        d3.select(this).lower();
      });
  });

  // Remove the tip if you tap on the wrapper (for mobile)
  wrapper.on("touchstart", () => tip.selectAll("*").remove());

  // Define the styles
  chart.appendChild(html`<style>
  .${id} .has-title { cursor: pointer;  pointer-events: all; }
  .${id} .has-title:hover { ${Object.entries(styles).map(([key, value]) => `${key}: ${value};`).join(" ")} }`);

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
  id: "d93908fb8a708e49@161",
  modules: [m0,m1,m2,m3]
};

export default notebook;
