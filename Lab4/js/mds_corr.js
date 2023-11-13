function parseCSVForMDSCorr(csvString) {
  const data = csvString.split(",");
  var ans = [];
  for (var i = 0; i < data.length; i += 2) {
    var temp = {};
    temp["x"] = parseFloat(data[i]);
    temp["y"] = parseFloat(data[i + 1]);
    ans.push(temp);
  }
  console.log(ans);
  return ans;
}
function plotMDSCorr(data) {
  const dim = {
    width: 540 - 80 - 40,
    height: 540 - 60 - 30,
    top: 60,
    right: 40,
    bottom: 30,
    left: 80,
  };
  const svg = d3
    .select("#mds-corr")
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
  svg
    .append("g")
    .attr("transform", "translate(0," + yScale(0) + ")")
    .call(xAxis);
  svg
    .append("g")
    .call(yAxis)
    .attr("transform", "translate(" + xScale(0) + ")");
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
    .style("fill", "#000080");
  var x_label = "MDS1";
  var y_label = "MDS2";

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -dim.left + 60)
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
    .attr("x", dim.width / 2)
    .attr("y", -10)
    .text("MDS Attributes")
    .style("font-size", 14)
    .style("font-weight", "bold");
}
