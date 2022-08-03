// URL: https://observablehq.com/@randomfractals/chicago-towed-vehicles
// Title: Chicago Towed Vehicles
// Author: Taras Novak (@randomfractals)
// Version: 150
// Runtime version: 1

const m0 = {
  id: "a113647eff1742ea@150",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Towed Vehicles

Information about the vehicles that have been towed and impounded by the City of Chicago within the last 90 days.

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation) / [Towed Vehicles](https://data.cityofchicago.org/Transportation/Towed-Vehicles/ygr5-vcbg)
`
)})
    },
    {
      inputs: ["md","data"],
      value: (function(md,data){return(
md`## Towed Vehicles in the last 90 days

Total: **${data.length.toLocaleString()}**`
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

### Towed Vehicles by Make, Style and Color Counts`
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
  id: "a113647eff1742ea@150",
  modules: [m0,m1]
};

export default notebook;
