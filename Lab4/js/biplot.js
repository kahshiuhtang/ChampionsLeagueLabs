function parseCSVForBiplot(csvString) {
  const lines = csvString.split("\n");
  const points = [];
  for (var i = 1; i < lines.length; i++) {
    var data = lines[i].split(",");
    var temp = {
      x: parseFloat(data[1]),
      y: parseFloat(data[2]),
      name: data[0],
    };
    points.push(temp);
  }
  console.log(points);
  return points;
}
function graphBiplot(data, lineData) {
  const dim = {
    width: 540 - 80 - 40,
    height: 540 - 60 - 30,
    top: 60,
    right: 40,
    bottom: 30,
    left: 80,
  };
  const svg = d3
    .select("#biplot")
    .append("svg")
    .attr("width", dim.width + dim.left + dim.right)
    .attr("height", dim.height + dim.top + dim.bottom)
    .append("g")
    .attr("transform", "translate(" + dim.left + "," + dim.top + ")");

  const xScale = d3.scaleLinear().domain([-0.7, 0.7]).range([0, dim.width]);
  const yScale = d3.scaleLinear().domain([-0.7, 0.7]).range([dim.height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
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
    .attr("r", 3)
    .style("fill", "#000080");
  var x_label = "PC1";
  var y_label = "PC2";
  svg
    .append("g")
    .attr("transform", "translate(0," + yScale(0) + ")")
    .call(xAxis);
  svg
    .append("g")
    .call(yAxis)
    .attr("transform", "translate(" + xScale(0) + ",0)");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -dim.left + 20)
    .attr("x", -yScale(0))
    .text(y_label)
    .style("font-size", 12)
    .style("font-weight", "bold");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", xScale(0))
    .attr("y", dim.height + dim.bottom)
    .text(x_label)
    .style("font-size", 12)
    .style("font-weight", "bold");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", xScale(0))
    .attr("y", -10)
    .text("Biplot with PC1 and PC2")
    .style("font-size", "20px")
    .style("font-weight", "bold");
  lineData.forEach(function (line) {
    svg
      .append("line")
      .style("stroke", "#B22222")
      .style("stroke-width", 3)
      .attr("x1", xScale(0))
      .attr("y1", yScale(0))
      .attr("x2", xScale(line.x))
      .attr("y2", yScale(line.y));
    svg
      .append("text")
      .attr("x", function () {
        if (line.name == "PassTypesTB") {
          return xScale(line.x) - 80;
        }
        return xScale(line.x);
      })
      .attr("y", function () {
        if (line.name == "SoT/90" || line.name == "Poss") {
          return yScale(line.y) - 10;
        }
        return yScale(line.y);
      })
      .text(line.name)
      .style("font-size", "12px")
      .style("font-weight", "bold");
  });
}
