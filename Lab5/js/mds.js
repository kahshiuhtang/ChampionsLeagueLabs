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
function plotMDSEucl(data, cluster_data) {
  createScatterMDSEucl(data, cluster_data);
}

function createScatterMDSEucl(data, cluster_data) {
  const dim = {
    width: 540 - 80 - 40,
    height: 540 - 60 - 30,
    top: 60,
    right: 40,
    bottom: 30,
    left: 80,
  };
  for (var i = 0; i < data.length; i++) {
    data[i]["cluster"] = cluster_data[i];
  }

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
  var circles = svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", function (d, i) {
      return colors[d.cluster];
    })
    .attr("cx", function (d) {
      return xScale(parseFloat(d.x));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d.y));
    })
    .attr("r", 4)
    .style("opacity", 0.5);
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
    .style("font-size", 12)
    .style("font-weight", "bold")
    .style("fill", "white");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", xScale(0))
    .attr("y", dim.height + dim.bottom)
    .text(x_label)
    .style("font-size", 12)
    .style("font-weight", "bold")
    .style("fill", "white");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", dim.width / 2)
    .attr("y", -10)
    .text("MDS Data Scatter")
    .style("font-size", 14)
    .style("font-weight", "bold")
    .style("fill", "white");
  svg.call(
    d3
      .brush()
      .extent([
        [0, 0],
        [dim.width, dim.height],
      ])
      .on("start brush", updateChart)
  );

  // Function that is triggered when brushing is performed
  function updateChart() {
    extent = d3.event.selection;
    circles.classed("selected", function (d) {
      return isBrushed(extent, x(parseFloat(d.x)), y(parseFloat(d.y)));
    });
  }

  // A function that return TRUE or FALSE according if a dot is in the selection or not
  function isBrushed(brush_coords, cx, cy) {
    var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];
    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
  }
}
