function parseBasicCSV(csvString) {
  const lines = csvString.split("\n");

  const result = [];
  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }
    const values = line.split(",");
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j].trim();
      const value = values[j].trim();
      row[header] = value;
    }
    result.push(row);
  }
  return result;
}
function parseLabel(label){
  if(label == "Year"){
    return " (Year)"
  }else if(label == "Posession"){
    return label  + " (%)"
  }else if(label == "GoalsAgainstPer90"){
    return label  + " (Goals)"
  }else if(label == "GoalieSave%"){
    return label  + " (%)"
  }else if(label == "TotalWins"){
    return label  + " (Wins)"
  }else if(label == "GoalieLaunchedComp%"){
    return label  + " (%)"
  }else if(label == "GoaliePassesLaunch%"){
    return label  + " (%)"
  }else if(label == "StandardSh/90"){
    return label  + " (Shots)"
  }else if(label == "StandardSoT/90"){
    return label  + " (Shots)"
  }else if(label == "TotalPassCmp%"){
    return label  + " (%)"
  }else if(label == "ChallengesTkl%"){
    return label  + " (%)"
  }else if(label == "Take-OnsSucc%"){
    return label  + " (%)"
  }else if(label == "TeamSuccess(xG)xG+/-90"){
    return label  + " (xG +/- 90)"
  }
}
function createMainHistogram(allData, clickHandler) {
  document.getElementById("starting-bar").innerHTML = "";
  var varName = document.getElementById("variable-select").value;
  var data = [];
  for (var i = 0; i < allData.length; i++) {
    data.push(parseFloat(allData[i][varName]));
  }
  const dim = {
    width: 740,
    height: 540,
    top: 60,
    bottom: 80,
    left: 40,
    right: 20,
  };
  var svg = d3
    .select("#starting-bar")
    .append("svg")
    .attr("width", dim.width + dim.left + dim.right)
    .attr("height", dim.height + dim.top + dim.bottom)
    .append("g")
    .attr("transform", "translate(" + dim.left + "," + dim.top + ")");
  var x = d3
    .scaleLinear()
    .domain([
      d3.min(data, function (d) {
        return d * 0.8;
      }),
      d3.max(data, function (d) {
        return d *1.1;
      }),
    ])
    .range([0, dim.width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + dim.height + ")")
    .call(d3.axisBottom(x));

  var histogram = d3
    .histogram()
    .value(function (d) {
      return d;
    })
    .domain(x.domain())
    .thresholds(x.ticks(7));

  var bins = histogram(data);
  var difference  = x(2) - x(1);
  console.log(difference)
  
  var y = d3.scaleLinear( ).range([dim.height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); 
  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })
    .attr("width", function (d) {
      return x(d.x1) - x(d.x0) - 1;
    })
    .attr("height", function (d) {
      return dim.height - y(d.length);
    }).
    on("click", function(d) {
      var min = 10000000;
      var max = -1111111;
      for(var i = 0; i < d.length; i++){
        if(d[i] < min) min = d[i];
        if(d[i] > max) max = d[i];
      }
      var color = clickHandler(min, max);

      d3.select(this).style("fill", color);
    })
    .style("fill", "#0c1821");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", dim.width / 2)
      .attr("y", dim.height + dim.bottom -  25)
      .style("fill", "white")
      .text(parseLabel(document.getElementById("variable-select").value))
      .style("font-size", 14);
}
