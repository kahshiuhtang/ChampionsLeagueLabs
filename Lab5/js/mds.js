function parseCSVForMDS(csvString) {
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
    row["x"] = parseFloat(values[1].trim());
    row["y"] = parseFloat(values[2].trim());
    result.push(row);
  }
  return result;
}
function plotMDSEucl(data, cluster_data, fullData) {
  createScatterMDSEucl(data, cluster_data, fullData);
}

function createScatterMDSEucl(data, rKeys, fullData) {
  $("#mds").html("");
  const dim = {
    width: 380 - 80 - 40,
    height: 380 - 60 - 30,
    top: 60,
    right: 40,
    bottom: 30,
    left: 80,
  };
  var colors = [
    "#001219",
    "#94d2bd",
    "#e9d8a6",
    "#ee9b00",
    "#e56b6f",
    "#57cc99",
    "#967aa1",
    "#4393c3",
    "#2166ac",
    "#54AD56",
  ];
  const svg = d3
    .select("#mds")
    .append("svg")
    .attr("width", dim.width + dim.left + dim.right)
    .attr("height", dim.height + dim.top + dim.bottom)
    .append("g")
    .attr("transform", "translate(" + dim.left + "," + dim.top + ")");

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => parseFloat(d.x)),
      d3.max(data, (d) => parseFloat(d.x)),
    ])
    .range([0, dim.width]);
  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => parseFloat(d.y)),
      d3.max(data, (d) => parseFloat(d.y)),
    ])
    .range([dim.height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  var keys = new Set();
  for (var i = 0; i < fullData.length; i++) {
    var key = fullData[i]["StandardSh/90"] + "," + fullData[i]["GoalieSave%"];
    if (rKeys.has(key)) {
      keys.add(i);
    }
  }
  var circles = svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", function (d, i) {
      if (keys.has(i)) {
        return "#a64d79";
      }
      return "#d0c8d6";
    })
    .attr("cx", function (d) {
      return xScale(parseFloat(d.x));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d.y));
    })
    .attr("r", 4);
  svg
    .append("g")
    .attr("transform", "translate(0," + yScale(0) + ")")
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", "translate(" + xScale(0) + ",0)")
    .call(yAxis);
  var x_label = "MDS1";
  var y_label = "MDS2";

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -dim.left + 20)
    .attr("x", -dim.top - dim.height / 2 + 60)
    .text(y_label)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "white");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", xScale(0))
    .attr("y", dim.height + dim.bottom)
    .text(x_label)
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("fill", "white");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", dim.width / 2)
    .attr("y", -10)
    .text("MDS Data Scatter")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("fill", "white");
}
