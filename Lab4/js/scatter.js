function parseCSVForCorrelationSum(csvString, prevData, headers) {
  var red_headers = [];
  const lines = csvString.split("\n");
  for (var i = 0; i < 8; i++) {
    const vals = lines[i].split(",");
    if (red_headers.length < 5) {
      var tObj = [headers[i], parseFloat(vals[1])];
      red_headers.push(tObj);
    } else {
      for (var j = 0; j < red_headers.length; j++) {
        if (red_headers[j][1] < parseFloat(vals[1])) {
          red_headers[j] = [headers[i], parseFloat(vals[1])];
          break;
        }
      }
    }
  }
  return red_headers;
}
function parseCSVForDataScatter(csvString) {
  var data = [];
  const lines = csvString.split("\n");
  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    var line = lines[i];
    const values = line.split(",");
    var tObj = {};
    for (var j = 2; j < values.length; j++) {
      tObj[headers[j]] = parseFloat(values[j]);
    }
    data.push(tObj);
  }
  return data;
}
function parseHeaders(csvString) {
  const lines = csvString.split("\n");
  const result = [];
  const headers = lines[0].split(",");
  return [
    "Poss",
    "SweeperAvgDist",
    "Per90npxG",
    "SoT/90",
    "LongCmp%",
    "PassTypesTB",
    "SCA90",
    "TacklesAtt3rd",
  ];
}
function createScatter5x5(data, headers) {
  var one_graph_width = 125;
  var padding = 10;
  var headers1 = [];
  var all_data = {};
  for (var i = 0; i < headers.length; i++) {
    headers1.push(headers[i][0]);
    var all = [];
    for (var j = 0; j < data.length; j++) {
      all.push(data[j][headers[i][0]]);
    }
    all_data[headers[i][0]] = all;
  }
  var position = {};
  headers1.forEach(function (field) {
    position[field] = d3
      .scaleLinear()
      .domain([d3.min(all_data[field]), d3.max(all_data[field])])
      .range([padding / 2, one_graph_width - padding / 2]);
  });
  var svg = d3
    .select("#scatter-5")
    .append("svg:svg")
    .attr("width", one_graph_width * headers.length + 100 + 50)
    .attr("height", one_graph_width * headers.length + 100 + 50)
    .attr("transform", "translate(25,25)");
  var column = svg
    .selectAll("g")
    .data(headers1)
    .enter()
    .append("svg:g")
    .attr("transform", function (d, i) {
      return "translate(" + i * one_graph_width + ",0)";
    });
  var rows = column
    .selectAll("g")
    .data(cross(headers1))
    .enter()
    .append("svg:g")
    .attr("transform", function (d, i) {
      return "translate(0," + i * one_graph_width + ")";
    });

  rows
    .selectAll("line.x")
    .data(function (d) {
      return position[d.x].ticks(5).map(position[d.x]);
    })
    .enter()
    .append("svg:line")
    .attr("class", "x")
    .attr("x1", function (d) {
      return d;
    })
    .attr("x2", function (d) {
      return d;
    })
    .attr("y1", padding / 2)
    .attr("y2", one_graph_width - padding / 2);

  rows
    .selectAll("line.y")
    .data(function (d) {
      return position[d.y].ticks(5).map(position[d.y]);
    })
    .enter()
    .append("svg:line")
    .attr("class", "y")
    .attr("x1", padding / 2)
    .attr("x2", one_graph_width - padding / 2)
    .attr("y1", function (d) {
      return d;
    })
    .attr("y2", function (d) {
      return d;
    });

  rows
    .append("svg:rect")
    .attr("x", padding / 2)
    .attr("y", padding / 2)
    .attr("width", one_graph_width - padding)
    .attr("height", one_graph_width - padding)
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", 1.5);
  var dots = rows
    .selectAll("circle")
    .data(cross(data))
    .enter()
    .append("svg:circle")
    .attr("cx", function (d) {
      return position[d.x.x](d.y[d.x.x]);
    })
    .attr("cy", function (d) {
      return one_graph_width - position[d.x.y](d.y[d.x.y]);
    })
    .attr("r", 2)
    .style("fill", "#000080");
  var bottom_labels = svg
    .selectAll(".bottom_labels")
    .data(headers)
    .enter()
    .append("g")
    .attr("class", "bottom_labels");

  bottom_labels
    .append("text")
    .attr("x", (d, idx) => idx * one_graph_width + 10)
    .attr("y", (d) => (one_graph_width + padding) * 5 - 25)
    .text(function (d) {
      return d[0];
    })
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
  var right_labels = svg
    .selectAll(".right_labels")
    .data(headers)
    .enter()
    .append("g")
    .attr("class", "right_labels");

  right_labels
    .append("text")
    .attr("x", (d) => (one_graph_width + padding) * 5 - 25)
    .attr("y", (d, idx) => idx * one_graph_width + 15)
    .text(function (d) {
      return d[0];
    })
    .attr("font-size", "12px")
    .attr("font-weight", "bold");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", 325)
    .attr("y", 675)
    .text("5x5 Most Correlated Scatter Plots")
    .style("font-size", "20px")
    .style("font-weight", "bold");
}

function cross(a) {
  return function (d) {
    var c = [];
    for (var i = 0; i < a.length; i++) c.push({ x: d, y: a[i] });
    return c;
  };
}
