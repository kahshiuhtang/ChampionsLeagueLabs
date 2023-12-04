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
    const row = [];
    for (let j = 1; j < headers.length; j++) {
      const value = values[j].trim();
      row[j - 1] = parseFloat(value);
    }
    const tRow = { x: headers[i] };
    tRow["values"] = row;
    result.push(tRow);
  }
  return result;
}
function parseCSVForCorrSum(csvString) {
  const sums = csvString.split("\n");
  const nums = [];
  for (var i = 1; i < sums.length; i++) {
    const row = sums[i].split(",");
    nums.push(parseFloat(row[1]));
  }
  return nums;
}
function plotCorrelationMatrix(data, sums) {
  var new_data = [];
  var headers = [];
  var length = data.length;
  for (var i = 0; i < data.length; i++) {
    var x = data[i]["x"];
    headers.push(x);
    for (var j = 0; j < data.length; j++) {
      var tRow = {};
      tRow["x"] = x;
      tRow["y"] = data[j]["x"];
      tRow["value"] = data[i]["values"][j];
      new_data.push(tRow);
    }
  }
  var margin = {
    top: 75,
    right: 100,
    bottom: 75,
    left: 150,
  };
  var width = 850 - margin.left - margin.right;
  var height = 700 - margin.top - margin.bottom;
  var domain = d3
    .set(
      new_data.map(function (d) {
        return d.x;
      })
    )
    .values();
  var color = d3
    .scaleLinear()
    .domain([-1, 0, 1])
    .range(["#B22222", "#fff", "#000080"]);

  var xScale = d3.scalePoint().range([0, width]).domain(domain);

  var yScale = d3.scalePoint().range([0, height]).domain(domain);
  var xSpace = xScale.range()[1] - xScale.range()[0];
  var ySpace = yScale.range()[1] - yScale.range()[0];

  var svg = d3
    .select("#correlation-matrix")
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var correlation_squares = svg
    .selectAll(".cor_square")
    .data(new_data)
    .enter()
    .append("g")
    .attr("class", "cor_square")
    .attr("transform", function (d) {
      return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")";
    });

  correlation_squares
    .append("rect")
    .attr("width", xSpace / 8)
    .attr("height", ySpace / 8)
    .attr("x", -xSpace / 16)
    .attr("y", -ySpace / 16);

  correlation_squares.style("fill", function (d) {
    return color(d.value);
  });

  var aS = d3
    .scaleLinear()
    .range([-margin.top + 42, height + margin.bottom - 48])
    .domain([1, -1]);

  var yAxis = d3.axisRight().scale(aS).tickPadding(10);

  var aG = svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .attr("transform", "translate(" + (width + margin.right / 2 + 10) + " ,0)");

  var r = d3.range(-1, 1.01, 0.01);
  var h = height / r.length + 3;
  r.forEach(function (d) {
    aG.append("rect")
      .style("fill", color(d))
      .attr("height", h)
      .attr("width", 10)
      .attr("x", 0)
      .attr("y", aS(d));
  });
  var left_labels = svg
    .selectAll(".left_labels")
    .data(new_data)
    .enter()
    .append("g")
    .attr("class", "left_labels");

  left_labels
    .append("text")
    .attr("x", (d) => -150)
    .attr("y", (d) => yScale(d.y))
    .text(function (d) {
      if (d.x === d.y) {
        return d.x;
      }
      return "";
    })
    .attr("font-size", 11)
    .attr("font-weight", "bold");

  var bottom_labels = svg
    .selectAll(".bottom_labels")
    .data(new_data)
    .enter()
    .append("g")
    .attr("class", "bottom_labels");

  bottom_labels
    .append("text")
    .attr("x", (d) => xScale(d.x) - xSpace / 17)
    .attr("y", (d) => height + margin.top)
    .text(function (d) {
      if (d.x === d.y) {
        return d.x;
      }
      return "";
    })
    .attr("font-size", 9)
    .attr("font-weight", "bold");
  var bottom_correlations = svg
    .selectAll(".bottom_corrs")
    .data(sums)
    .enter()
    .append("g")
    .attr("class", "bottom_corrs");

  bottom_correlations
    .append("text")
    .attr("x", (d, idx) => idx * 86 - xSpace / 17)
    .attr("y", (d) => height + margin.top - 20)
    .text(function (d) {
      return d.toFixed(3);
    })
    .attr("font-size", 9);
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", -40)
    .text("8x8 Correlation Matrix")
    .style("font-size", "20px")
    .style("font-weight", "bold");
}
