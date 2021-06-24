// URL: https://observablehq.com/@randomfractals/chicago-public-chauffeurs
// Title: Chicago Public Chauffeurs
// Author: Taras Novak (@randomfractals)
// Version: 43
// Runtime version: 1

const m0 = {
  id: "a4fda91cd9c4daae@43",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Public Chauffeurs

Data Source: [Chicago Community Economic Development](https://data.cityofchicago.org/browse?q=community%20economic%20development&sortBy=relevance) / [Public Chauffeurs](https://data.cityofchicago.org/Community-Economic-Development/Public-Chauffeurs/97wa-y6ff)

Chicago Data Portal: [Public Chauffeurs - Dashboard](https://data.cityofchicago.org/Community-Economic-Development/Public-Chauffeurs-Dashboard/3dz4-khtp)
`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`## Data`
)})
    },
    {
      name: "viewof dataSummaryView",
      inputs: ["SummaryTable","data"],
      value: (function(SummaryTable,data){return(
SummaryTable(data, {label: 'Public Chauffeurs Data'})
)})
    },
    {
      name: "dataSummaryView",
      inputs: ["Generators","viewof dataSummaryView"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof tableView",
      inputs: ["Inputs","data"],
      value: (function(Inputs,data){return(
Inputs.table(data, {
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
      name: "dataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/97wa-y6ff.json'
)})
    },
    {
      name: "query",
      value: (function(){return(
`?$limit=25000`
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
      inputs: ["md"],
      value: (function(md){return(
md`## Imports`
)})
    },
    {
      from: "@observablehq/summary-table",
      name: "SummaryTable",
      remote: "SummaryTable"
    }
  ]
};

const m1 = {
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

const m2 = {
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
  id: "a4fda91cd9c4daae@43",
  modules: [m0,m1,m2]
};

export default notebook;
