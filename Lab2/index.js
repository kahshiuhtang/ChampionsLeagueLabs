function clearGraphs() {
  document.getElementById("bar-chart").innerHTML = "";
  document.getElementById("pie-chart").innerHTML = "";
  document.getElementById("scatter-plot").innerHTML = "";
}

function parseCSV(csvString) {
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
function getVariableLabels() {
  return {
    Year: "Year (Years)",
    Age: "Age (Years)",
    SweeperAvgDist: "Sweeper Average Distance (Meters)",
    Per90MinutesnpxG: "Non-Penalty Expected Goals Per 90 Minutes (Goals)",
    "LongCmp%": "Long Pass Completion Percentage (30 meters+ Passes)",
    "StandardSoT/90": "Standard Shots on Target Per 90 Minutes (Shots)",
    PassTypesTB: "Through Ball Passes (Passes)",
    PassTypesSw: "Switch Passes (Passes)",
    SCA90: "Shot Creating Actions Per 90 Minutes (Actions)",
    "Tkl+Int": " Combined Tackles + Interceptions",
    TouchesDef3rd: "Touches in Defensive 3rd (Touches)",
  };
}
function handleSetVariable() {
  var selectedVariable = "";
  var radioButtons = document.getElementsByName("var");

  if (document.getElementById("variable-select")) {
    selectedVariable = document.getElementById("variable-select").value;
  }
  if (radioButtons[0].checked) {
    document.getElementById("x-var").value = selectedVariable;
    document.getElementById("selected-x-var").innerHTML =
      "Selected X-Variable: " + getVariableLabels()[selectedVariable];
  } else {
    document.getElementById("y-var").value = selectedVariable;
    document.getElementById("selected-y-var").innerHTML =
      "Selected Y-Variable: " + getVariableLabels()[selectedVariable];
  }
}
function getDataSet(data, axisData) {
  var varNameX = axisData.x;
  var varNameY = axisData.y;
  var newData = [];
  for (var i = 0; i < data.length; i++) {
    newData.push({ x: data[i][varNameX], y: data[i][varNameY] });
  }
  return newData;
}
function createGraph() {
  var data = "";
  if (document.getElementById("data-string")) {
    data = document.getElementById("data-string").value;
  }
  data = JSON.parse(data);
  clearGraphs();
  if (document.getElementById("scatter").checked == true) {
    createScatter(data);
  } else if (document.getElementById("bar").checked == true) {
    createHist(data);
  } else if (document.getElementById("pie").checked == true) {
    createPie(data);
  }
}
function createHist(allData) {
  var varName = document.getElementById("variable-select").value;
  var data = [];
  for (var i = 0; i < allData.length; i++) {
    data.push(parseFloat(allData[i][varName]));
  }
  var x_label = getVariableLabels()[varName];

  const dim = {
    width: 540,
    height: 480,
    mTop: 30,
    mBottom: 30,
    mLeft: 20,
    mRight: 20,
  };
  const bins = d3
    .bin(data)
    .thresholds(10)
    .value((d) => d)(data);
  const x = d3
    .scaleLinear()
    .domain([bins[0].x0, bins[bins.length - 1].x1])
    .range([dim.mLeft, dim.width - dim.mRight]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(bins, (d) => d.length)])
    .range([dim.height - dim.mBottom, dim.mTop]);

  const svg = d3
    .select("#bar-chart")
    .append("svg")
    .attr("width", dim.width)
    .attr("height", dim.height)
    .attr("viewBox", [0, 0, dim.width, dim.height])
    .attr("style", "max-width: 100%; height: auto;");

  svg
    .append("g")
    .attr("fill", "#F2B5D4")
    .selectAll()
    .data(bins)
    .join("rect")
    .attr("x", (d) => x(d.x0) + 1 + 5)
    .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
    .attr("y", (d) => y(d.length))
    .attr("height", (d) => y(0) - y(d.length));

  svg
    .append("g")
    .attr("transform", `translate(0,${dim.height - dim.mBottom})`)
    .call(d3.axisBottom(x).ticks(dim.width / 80))
    .call((g) =>
      g
        .append("text")
        .attr("x", dim.width)
        .attr("y", dim.mBottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(x_label)
    );
  svg
    .append("g")
    .attr("transform", `translate(${dim.mLeft + 5},0)`)
    .call(d3.axisLeft(y).ticks(dim.height / 50))
    .call((g) =>
      g
        .append("text")
        .attr("x", -dim.mLeft + 5)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Frequency (no. of teams)")
    );
  if (x_label == "Year (Years)") {
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", dim.width / 2)
      .attr("y", 15)
      .text(x_label + " Bar Chart")
      .style("font-size", 14);
  } else {
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", dim.width / 2)
      .attr("y", 15)

      .text(x_label + " Histogram")
      .style("font-size", 14);
  }
}
function createPie(allData) {
  var varName = document.getElementById("variable-select").value;
  var data1 = [];
  for (var i = 0; i < allData.length; i++) {
    data1.push(parseFloat(allData[i][varName]));
  }
  const dim = {
    width: 640,
    height: 640,
    mTop: 100,
    mBottom: 100,
    mLeft: 100,
    mRight: 100,
  };
  const data = d3
    .bin(data1)
    .thresholds(4)
    .value((d) => d)(data1);
  var labels = [];
  for (var i = 0; i < data.length; i++) {
    labels.push(data[i].x0 + "-" + data[i].x1);
  }
  const x = d3
    .scaleLinear()
    .domain([data[0].x0, data[data.length - 1].x1])
    .range([dim.mLeft, dim.width - dim.mRight]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.length)])
    .range([dim.height - dim.mBottom, dim.mTop]);

  var radius = (Math.min(dim.width, dim.height) - dim.mTop * 2) / 2; // Radius of the pie chart
  var color = d3
    .scaleOrdinal()
    .domain(data)
    .range(["#6b486b", "#98abc5", "#8a89a6", "#7b6888", "#037171", "#a05d56"]);

  var svg = d3
    .select("#pie-chart")
    .append("svg")
    .attr("width", dim.width)
    .attr("height", dim.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + dim.width / 2 + "," + dim.height / 2 + ")"
    );
  data1 = [];

  for (var i = 0; i < data.length; i++) {
    data1.push(data[i].length);
  }
  var pie = d3.pie().value(function (d) {
    return parseFloat(d);
  });
  var data_ready = pie(data1);
  svg
    .selectAll("slice")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
    .attr("fill", function (d) {
      return color(d.index);
    })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);
  var arc = d3
    .arc()
    .innerRadius(radius)
    .outerRadius(radius * 1.4);
  svg
    .selectAll("slice")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function (d) {
      return labels[d.index];
    })
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .style("text-anchor", "middle")
    .style("font-size", 12)
    .style("fill", function (d) {
      return color(d.index);
    });
  svg
    .selectAll("slice")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function (d) {
      return labels[d.index];
    })
    .attr("transform", function (d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .style("text-anchor", "middle")
    .style("font-size", 12)
    .style("fill", function (d) {
      return color(d.index);
    });
  var total = d3.sum(data_ready, (d) => d.value);

  var arc1 = d3
    .arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius);

  svg
    .selectAll("slice")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function (d) {
      return ((d.value / total) * 100).toPrecision(3) + "%";
    })
    .attr("transform", function (d) {
      return "translate(" + arc1.centroid(d) + ")";
    })
    .style("text-anchor", "middle")
    .style("font-size", 10);
  var x_label = getVariableLabels()[varName];
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", -dim.height / 2 + dim.mTop - 50)
    .attr("x", 0)
    .text(x_label + " Pie Chart")
    .style("font-size", 14);
}
function createAxisData() {
  var xName = "";
  var yName = "";
  if (document.getElementById("x-var")) {
    xName = document.getElementById("x-var").value;
  }
  if (document.getElementById("y-var")) {
    yName = document.getElementById("y-var").value;
  }
  if (xName == "" || yName == "") {
    return null;
  }
  return { x: xName, y: yName };
}
function createScatter(rawData) {
  var variables = createAxisData();
  const data = getDataSet(rawData, variables);
  const dim = {
    width: 540 - 80 - 40,
    height: 540 - 60 - 30,
    top: 60,
    right: 40,
    bottom: 30,
    left: 80,
  };
  const svg = d3
    .select("#scatter-plot")
    .append("svg")
    .attr("width", dim.width + dim.left + dim.right)
    .attr("height", dim.height + dim.top + dim.bottom)
    .append("g")
    .attr("transform", "translate(" + dim.left + "," + dim.top + ")");

  // Set up scales for the x and y axes
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => parseFloat(d.x)),
      d3.max(data, (d) => parseFloat(d.x)),
    ]) // Data Range
    .range([0, dim.width]);
  maxY = d3.max(data, (d) => parseFloat(d.y));
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => parseFloat(d.y)), maxY])
    .range([dim.height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("transform", "translate(0," + dim.height + ")")
    .call(xAxis);
  svg.append("g").call(yAxis);
  // Create circles for each data point
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(parseFloat(d.x));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d.y));
    })
    .attr("r", 4)
    .style("fill", "white");
  var x_label = getVariableLabels()[variables.x];
  var y_label = getVariableLabels()[variables.y];

  // Y axis label:
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -dim.left + 20)
    .attr("x", -dim.top - dim.height / 2 + 20)
    .text(y_label)
    .style("font-size", 12);
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", dim.width / 2 + dim.left)
    .attr("y", dim.height + dim.bottom)
    .text(x_label)
    .style("font-size", 12);

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", dim.width / 2)
    .attr("y", -10)
    .text(x_label + " vs. " + y_label + " Scatter Plot")
    .style("font-size", 14);
}
