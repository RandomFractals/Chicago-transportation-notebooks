// URL: https://observablehq.com/@randomfractals/chicago-traffic-crash-plots
// Title: Chicago Traffic Crash Plots
// Author: Taras Novak (@randomfractals)
// Version: 510
// Runtime version: 1

const m0 = {
  id: "c1947355b4b729d1@510",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Chicago Traffic Crash Plots

Data Source: [Chicago Transportation](https://data.cityofchicago.org/browse?category=Transportation) / [Traffic Crashes](https://data.cityofchicago.org/Transportation/Traffic-Crashes-Crashes/85ca-t3if)

Chicago Data Portal: [Traffic Crashes Dashboard](https://data.cityofchicago.org/Transportation/Traffic-Crashes-Crashes-Dashboard/8tdq-a5dp)
`
)})
    },
    {
      name: "viewof year",
      inputs: ["Inputs","years"],
      value: (function(Inputs,years){return(
Inputs.select(years, {value: 2021, label: 'Select Year:', format: year => year})
)})
    },
    {
      name: "year",
      inputs: ["Generators","viewof year"],
      value: (G, _) => G.input(_)
    },
    {
      name: "dayPlot",
      inputs: ["Plot","crashesByDate","d3"],
      value: (function(Plot,crashesByDate,d3){return(
Plot.plot({
  height: 180,
  x: {
    axis: null,
    padding: 0,
  },
  y: {
    label: 'Week Day',
    padding: 0,
    tickFormat: Plot.formatWeekday('en', 'narrow'),
    tickSize: 0
  },
  fy: {
    reverse: true
  },
  facet: {
    data: crashesByDate,
    y: d => d.date.getUTCFullYear()
  },
  color: {
    scheme: "BuYlRd"
  },
  marks: [
    Plot.cell(crashesByDate, {
      x: d => d3.utcWeek.count(d3.utcYear(d.date), d.date),
      y: d => d.date.getUTCDay(),
      fill: 'count',
      title: d => `${d.date.toLocaleDateString()}: ${d.count.toLocaleString()} crashes`,
      inset: 0.5
    })
  ]
})
)})
    },
    {
      inputs: ["Plot","width","crashesByDate"],
      value: (function(Plot,width,crashesByDate){return(
Plot.plot({
  width: width,
  height: 300,
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
    Plot.cell(crashesByDate, {
      x: d => d.date.getUTCDate(),
      y: d => d.date.getUTCMonth(),
      fill: 'count',
      inset: 0.5
    }),
    Plot.text(crashesByDate, {
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
      inputs: ["vl","crashesByDate"],
      value: (function(vl,crashesByDate)
{
  const brush = vl.selectInterval().encodings('x');
  const x = vl.x().fieldT('date').title('date');
  
  const base = vl.markArea()
    .encode(x, vl.y().fieldQ('count').title('crash count'))
    .width(700);
  
  return vl.data(crashesByDate)
    .vconcat(
      base.encode(x.scale({domain: brush})),
      base.params(brush).height(60)
    )
    .title('Crashes by Date')
    .render();
}
)
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Crashes per Month, Day of the Week and Hour`
)})
    },
    {
      name: "monthPlot",
      inputs: ["Plot","width","crashesByMonth"],
      value: (function(Plot,width,crashesByMonth){return(
Plot.plot({
  width: width/3,
  height: 320,
  x: {
    label: 'month',
    tickFormat: Plot.formatMonth('en', 'short')
  },
  marks: [
    Plot.barY(crashesByMonth, {
      x: 'crash_month', 
      y: 'count', 
      fill: 'steelblue',
      title: d => `${d.count.toLocaleString()} crashes`
    })
  ]
})
)})
    },
    {
      name: "dayOfWeekPlot",
      inputs: ["Plot","width","crashesByDayOfWeek"],
      value: (function(Plot,width,crashesByDayOfWeek){return(
Plot.plot({
  width: width/4,
  height: 320,
  x: {
    label: 'day of the week',
    tickFormat: Plot.formatWeekday('en', 'narrow')
  },
  marks: [
    Plot.barY(crashesByDayOfWeek, {
      x: 'crash_day_of_week', 
      y: 'count', 
      fill: 'steelblue',
      title: d => `${d.count.toLocaleString()} crashes`,
    })
  ]
})
)})
    },
    {
      name: "hourPlot",
      inputs: ["vl","crashesByHour"],
      value: (function(vl,crashesByHour){return(
vl.markBar()
  .data(crashesByHour)
  .encode(
    vl.x().fieldQ('crash_hour')
      .axis({title: 'hour'}),
    vl.y().fieldQ('count')
      .axis({title: 'total crashes'}),
    vl.tooltip().fieldN('count')
  )
  .width(24 * 14)
  .render()
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Injuries`
)})
    },
    {
      name: "injuriesTotalPlot",
      inputs: ["vl","injuriesCount","width"],
      value: (function(vl,injuriesCount,width){return(
vl.markBar().data(injuriesCount).encode(
  vl.y().fieldO('injury_type').sort({encoding: 'x'}).axis({title: 'Type'}),
  vl.x().fieldQ('count').axis({title: 'Total'}),
  vl.tooltip().fieldN('count')
).width(width - 200).render()
)})
    },
    {
      name: "injuriesPlot",
      inputs: ["vl","year","injuriesByDate","width"],
      value: (function(vl,year,injuriesByDate,width)
{
  const hover = vl.selectSingle('hover')
    .on('mouseover')
    .encodings('x')
    .nearest(true)
    .clear('moouseout')
    .init({x: {year: year, month: 1, date: 1}});
  
  const lineAndPoint = vl.layer(vl.markLine(), vl.markPoint().transform(vl.filter(hover)))
    .encode(
      vl.y().fieldQ('injury_count'),
      vl.color().fieldN('injury_type')
    );
  
  const rule = vl.markRule({strokeWidth: 0.5, tooltip: true})
    .transform(vl.pivot('injury_type').value('injury_count').groupby(['date']))
    .encode(vl.opacity().value(0).if(hover, vl.value(0.7)),
      vl.tooltip([
        vl.fieldT('date'),
        'injuries_total',
        'injuries_reported_not_evident',
        'injuries_incapacitating',      
        'injuries_fatal',      
      ])
    ).select(hover);

  return vl.layer(lineAndPoint, rule)
    .encode(vl.x().fieldT('date'))
    .data(injuriesByDate)
    .width(width - 240)
    .height(300)
    .render();
}
)
    },
    {
      name: "injuriesByMonthPlot",
      inputs: ["Plot","width","injuriesByMonth"],
      value: (function(Plot,width,injuriesByMonth){return(
Plot.plot({
    width: width/3,
    y: {
      grid: true, 
      label: 'Injuries',
      tickFormat: 's'
    },
    fx: {
      label: 'month',      
      tickFormat: Plot.formatMonth('en', 'short')
    },
    facet: {
      data: injuriesByMonth, 
      x: 'crash_month'
    },
    marks: [
      Plot.barY(injuriesByMonth,
        Plot.stackY(Plot.groupZ({y: 'sum'}, {y: 'injury_count', fill: 'injury_type'}))
      )
    ]
  })
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Damages`
)})
    },
    {
      name: "damagesTotalPlot",
      inputs: ["vl","damagesCount","width"],
      value: (function(vl,damagesCount,width){return(
vl.markBar().data(damagesCount).encode(
  vl.y().fieldO('damage').sort({encoding: 'x'}).axis({title: 'Type'}),
  vl.x().fieldQ('count').axis({title: 'Total'}),
  vl.tooltip().fieldN('count')
).width(width - 200).render()
)})
    },
    {
      name: "damagesPlot",
      inputs: ["vl","year","damagesByDate","width"],
      value: (function(vl,year,damagesByDate,width)
{
  const hover = vl.selectSingle('hover')
    .on('mouseover')
    .encodings('x')
    .nearest(true)
    .clear('moouseout')
    .init({x: {year: year, month: 1, date: 1}});
  
  const lineAndPoint = vl.layer(vl.markLine(), vl.markPoint().transform(vl.filter(hover)))
    .encode(
      vl.y().fieldQ('count'),
      vl.color().fieldN('damage')
    );
  
  const rule = vl.markRule({strokeWidth: 0.5, tooltip: true})
    .transform(vl.pivot('damage').value('count').groupby(['date']))
    .encode(vl.opacity().value(0).if(hover, vl.value(0.7)),
      vl.tooltip([
        vl.fieldT('date'),
        'OVER $1,500',
        '$501 - $1,500',
        '$500 OR LESS',
      ])
    ).select(hover);

  return vl.layer(lineAndPoint, rule)
    .encode(vl.x().fieldT('date'))
    .data(damagesByDate)
    .width(width - 160)
    .height(300)
    .render();
}
)
    },
    {
      name: "damagesByMonthPlot",
      inputs: ["Plot","width","damagesByMonth"],
      value: (function(Plot,width,damagesByMonth){return(
Plot.plot({
    width: width/3,
    y: {
      grid: true, 
      label: 'Damages',
      tickFormat: 's'
    },
    fx: { 
      label: 'month',
      tickFormat: Plot.formatMonth('en', 'short')
    },
    facet: {
      data: damagesByMonth, 
      x: 'crash_month'
    },
    marks: [
      Plot.barY(damagesByMonth,
        Plot.stackY(Plot.groupZ({y: 'sum'}, {y: 'count', fill: 'damage'}))
      )
    ]
  })
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Top 20 Primary Crash Causes`
)})
    },
    {
      name: "primaryCausesPlot",
      inputs: ["vl","primaryCrashCauses","width"],
      value: (function(vl,primaryCrashCauses,width){return(
vl.markBar().data(primaryCrashCauses).encode(
  vl.y().fieldO('prim_contributory_cause').sort({encoding: 'x'}).axis({title: 'Type'}),
  vl.x().fieldQ('count').axis({title: 'Total'}),
  vl.tooltip().fieldN('count')
).width(width - 200).render()
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Top 20 Secondary Crash Causes`
)})
    },
    {
      name: "secondaryCausesPlot",
      inputs: ["vl","secondaryCrashCauses","width"],
      value: (function(vl,secondaryCrashCauses,width){return(
vl.markBar().data(secondaryCrashCauses).encode(
  vl.y().fieldO('sec_contributory_cause').sort({encoding: 'x'}).axis({title: 'Type'}),
  vl.x().fieldQ('count').axis({title: 'Total'}),
  vl.tooltip().fieldN('count')
).width(width - 200).render()
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`### Driving Conditions`
)})
    },
    {
      name: "weatherConditionPlot",
      inputs: ["vl","weatherConditions","width"],
      value: (function(vl,weatherConditions,width){return(
vl.markBar().data(weatherConditions).encode(
  vl.y().fieldO('weather_condition').sort({encoding: 'x'}).axis({title: 'Weather'}),
  vl.x().fieldQ('count').axis({title: 'Total'}),
  vl.tooltip().fieldN('count')
).width(width - 200).render()
)})
    },
    {
      name: "lightingConditionPlot",
      inputs: ["vl","lightingConditions","width"],
      value: (function(vl,lightingConditions,width){return(
vl.markBar().data(lightingConditions).encode(
  vl.y().fieldO('lighting_condition').sort({encoding: 'x'}).axis({title: 'Lighting'}),
  vl.x().fieldQ('count').axis({title: 'Total'}),
  vl.tooltip().fieldN('count')
).width(width - 200).render()
)})
    },
    {
      name: "roadwayConditionPlot",
      inputs: ["vl","roadwayConditions","width"],
      value: (function(vl,roadwayConditions,width){return(
vl.markBar().data(roadwayConditions).encode(
  vl.y().fieldO('roadway_surface_cond').sort({encoding: 'x'}).axis({title: 'Roadway Surface'}),
  vl.x().fieldQ('count').axis({title: 'Total'}),
  vl.tooltip().fieldN('count')
).width(width - 200).render()
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
      name: "viewof injuriesTable",
      inputs: ["Inputs","injuriesByDate"],
      value: (function(Inputs,injuriesByDate){return(
Inputs.table(injuriesByDate, {
  reverse: true
})
)})
    },
    {
      name: "injuriesTable",
      inputs: ["Generators","viewof injuriesTable"],
      value: (G, _) => G.input(_)
    },
    {
      name: "viewof damagesTable",
      inputs: ["Inputs","damagesByDate"],
      value: (function(Inputs,damagesByDate){return(
Inputs.table(damagesByDate, {
  reverse: true
})
)})
    },
    {
      name: "damagesTable",
      inputs: ["Generators","viewof damagesTable"],
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
[2020, 2021]
)})
    },
    {
      name: "columns",
      value: (function(){return(
[
  'crash_date',
  'crash_type',
  'posted_speed_limit',
  'weather_condition',
  'lighting_condition',
  'first_crash_type',
  'trafficway_type',
  'alignment',
  'roadway_sourface_cond',
  'road_defect',
  'report_type',
  'private_property',
  'hit_and_run_i',
  'damage',
  'date_police_notified',
  'prim_contributory_cause',
  'sec_contributory_cause',
  'street_no',
  'street_direction',
  'street_name',
  'beat_of_occurrence',
  'photos_taken_i',
  'num_units',
  'most_severe_injury',
  'injuries_total',
  'injuries_fatal',
  'injuries_incapacitating',
  'injuries_reported_not_evident',
  'injuries_no_indication',
  'injuries_unknown',
  'crash_hour',
  'crash_day_of_week',
  'crash_month',
  'latitude',
  'longitude'
]
)})
    },
    {
      name: "dataUrl",
      value: (function(){return(
'https://data.cityofchicago.org/resource/85ca-t3if.json'
)})
    },
    {
      name: "query",
      inputs: ["year"],
      value: (function(year){return(
`?$limit=100000&$where=crash_date between '${year}-01-01T00:00:00' and '${year}-12-31T23:59:59'`
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
    date_time: d => op.parse_date(d.crash_date)
  })
  .spread({crash_date: d => op.split(d.crash_date, 'T')}, {as: ['date', 'time']})
  .orderby('posted_speed_limit')
)})
    },
    {
      name: "crashesByDate",
      inputs: ["dataTable","op"],
      value: (function(dataTable,op){return(
dataTable.groupby('date').count()
  .derive({
    date: d => op.parse_date(d.date)
  })
)})
    },
    {
      name: "crashesByMonth",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.select('crash_month').groupby('crash_month').count()
  .derive({
    crash_month: d => d.crash_month - 1
  })
)})
    },
    {
      name: "crashesByDayOfWeek",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.select('crash_day_of_week').groupby('crash_day_of_week').count()
  .derive({
    crash_day_of_week: d => d.crash_day_of_week - 1
  })
)})
    },
    {
      name: "crashesByHour",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.select('crash_hour').groupby('crash_hour').count()
)})
    },
    {
      name: "crashesBySpeedLimit",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.select('posted_speed_limit').groupby('posted_speed_limit').count()
)})
    },
    {
      name: "injuryColumns",
      value: (function(){return(
[
  'injuries_total',
  'injuries_fatal',
  'injuries_incapacitating',
  'injuries_reported_not_evident',
  'injuries_no_indication',
  'injuries_unknown'
]
)})
    },
    {
      name: "injuries",
      inputs: ["dataTable","aq","op"],
      value: (function(dataTable,aq,op){return(
dataTable
  .select(
    'date',   
    'injuries_total',
    'injuries_fatal',
    'injuries_incapacitating',
    'injuries_reported_not_evident',
    'injuries_unknown'
  )
  .fold(aq.not('date'), {
    as: ['injury_type', 'injury_count']
  })
  .filter(d => d.injury_count > 0)
  .derive({
    date: d => op.parse_date(d.date),
  })
)})
    },
    {
      name: "injuriesCount",
      inputs: ["injuries","op"],
      value: (function(injuries,op){return(
injuries.select('injury_type', 'injury_count')
  .groupby('injury_type')
  .rollup({
    count: d => op.sum(d.injury_count)
  })
)})
    },
    {
      name: "injuriesByMonth",
      inputs: ["dataTable","aq","op"],
      value: (function(dataTable,aq,op){return(
dataTable.select(
    'crash_month',
    'injuries_total',
    'injuries_fatal',
    'injuries_incapacitating',
    'injuries_reported_not_evident',
    'injuries_unknown'
  )
  .fold(aq.not('crash_month'), {
    as: ['injury_type', 'injury_count']
  })
  .filter(d => d.injury_count > 0)
  .derive({
    crash_month: d => d.crash_month - 1
  })
  .groupby('crash_month', 'injury_type')
  .rollup({
    injury_count: d => op.sum(d.injury_count)
  })
)})
    },
    {
      name: "injuriesByDate",
      inputs: ["injuries","op"],
      value: (function(injuries,op){return(
injuries.groupby('date', 'injury_type')
  .rollup({
    injury_count: d => op.sum(d.injury_count)
  })
  .orderby('date')
)})
    },
    {
      name: "damages",
      inputs: ["dataTable","op"],
      value: (function(dataTable,op){return(
dataTable.select('date', 'damage')
  .derive({
    date: d => op.parse_date(d.date),
  })
)})
    },
    {
      name: "damagesCount",
      inputs: ["damages"],
      value: (function(damages){return(
damages.groupby('damage').count()
)})
    },
    {
      name: "damagesByMonth",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.select('crash_month', 'damage')
  .derive({
    crash_month: d => d.crash_month - 1
  })
  .groupby('crash_month', 'damage').count()
)})
    },
    {
      name: "damagesByDate",
      inputs: ["damages"],
      value: (function(damages){return(
damages.groupby('date', 'damage').count().orderby('date')
)})
    },
    {
      name: "primaryCrashCauses",
      inputs: ["dataTable","aq"],
      value: (function(dataTable,aq){return(
dataTable.select('prim_contributory_cause')
  .groupby('prim_contributory_cause')
  .count()
  .orderby(aq.desc('count'))
  .slice(0, 20)
)})
    },
    {
      name: "secondaryCrashCauses",
      inputs: ["dataTable","aq"],
      value: (function(dataTable,aq){return(
dataTable.select('sec_contributory_cause')
  .groupby('sec_contributory_cause')
  .count()
  .orderby(aq.desc('count'))
  .slice(0, 20)
)})
    },
    {
      name: "weatherConditions",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.select('weather_condition')
  .groupby('weather_condition')
  .count()
)})
    },
    {
      name: "lightingConditions",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.select('lighting_condition')
  .groupby('lighting_condition')
  .count()
)})
    },
    {
      name: "roadwayConditions",
      inputs: ["dataTable"],
      value: (function(dataTable){return(
dataTable.select('roadway_surface_cond')
  .groupby('roadway_surface_cond')
  .count()
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

const notebook = {
  id: "c1947355b4b729d1@510",
  modules: [m0,m1]
};

export default notebook;
