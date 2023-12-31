function createScatter(data, varX, varY, plotID, keys) {
  if (keys == null) {
    keys = new Set();
  }
  $(plotID).html("");
  const dim = {
    width: 380 - 80 - 40,
    height: 380 - 60 - 30,
    top: 60,
    right: 20,
    bottom: 70,
    left: 80,
  };
  const svg = d3
    .select(plotID)
    .append("svg")
    .attr("width", dim.width + dim.left + dim.right)
    .attr("height", dim.height + dim.top + dim.bottom)
    .append("g")
    .attr("transform", "translate(" + dim.left + "," + dim.top + ")");
  // Set up scales for the x and y axes
  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => {
        return parseFloat(d[varX]);
      }),
      d3.max(data, (d) => parseFloat(d[varX])),
    ]) // Data Range
    .range([0, dim.width]);
  maxY = d3.max(data, (d) => {
    return parseFloat(d[varY]);
  });
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => parseFloat(d[varY])), maxY])
    .range([dim.height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("transform", "translate(0," + dim.height + ")")
    .call(xAxis);
  svg.append("g").call(yAxis);
  // Create circles for each data point
  var circ = svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(parseFloat(d[varX]));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d[varY]));
    })
    .attr("r", 4)
    .style("fill", function (d) {
      var key = d["StandardSh/90"] + "," + d["GoalieSave%"];
      if (keys.has(key)) {
        return "#a64d79";
      }
      return "#d0c8d6";
    });

  // Y axis label:
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -dim.left + 20)
    .attr("x", -dim.top - dim.height / 2 + 30)
    .text(varY)
    .style("font-size", "14px")
    .style("fill", "white");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", dim.width / 2)
    .attr("y", dim.height + dim.bottom - 20)
    .text(varX)
    .style("font-size", "14px")
    .style("fill", "white");
  if (varX === "GoalieLaunchedComp%") [(varX = "GLaunchComp%")];
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", dim.width / 2)
    .attr("y", -10)
    .text(varX + " vs. " + varY)
    .style("font-size", "14px")
    .style("fill", "white");
}
