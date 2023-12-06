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
  return points;
}
function graphBiplot(data, lineData, handleClick) {
  console.log(data);
  console.log(lineData);
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
  var cir = svg
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
    .style("fill", "black");
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
        if (line.name == "GoalsAgainstPer90") {
          return xScale(line.x) - 100;
        } else if (line.name == "TotalWins") {
          return xScale(line.x) + 100;
        } else if (line.name == "Posession") {
        } else if (line.name == "GoaliePassesLaunch%") {
          return xScale(line.x) - 100;
        } else if (line.name == "StandardSh/90") {
          return xScale(line.x) + 40;
        } else if (line.name == "GoalsAgainstPer90") {
        }
        return xScale(line.x);
      })
      .attr("y", function () {
        if (line.name == "TotalPassCmp%") {
          return yScale(line.y) - 13;
        } else if (line.name == "StandardSh/90") {
          return yScale(line.y) + 17;
        } else if (line.name == "TeamSuccess(xG)xG+/-90") {
          return yScale(line.y) + 10;
        } else if (line.name == "StandardSoT/90") {
          return yScale(line.y) + 17;
        } else if (line.name == "Posession") {
          return yScale(line.y) - 4;
        } else if (line.name == "GoalieSave%") {
          return yScale(line.y) + 9;
        }
        return yScale(line.y);
      })
      .text(line.name)
      .style("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "bold");
  });
  svg.call(
    d3
      .brush() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [dim.width, dim.height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
  );

  // Function that is triggered when brushing is performed
  function updateChart() {
    extent = d3.event.selection;
    var xyIDS = new Set();
    cir.classed("selected", function (d) {
      if (isBrushed(extent, xScale(d.x), yScale(d.y)) == true) {
        xyIDS.add(d.x + "," + d.y);
      }
      return isBrushed(extent, xScale(d.x), yScale(d.y));
    });
    var realIDs = new Set();
    for (var i = 0; i < data.length; i++) {
      if (xyIDS.has(data[i].x + "," + data[i].y)) {
        realIDs.add(i);
      }
    }
    handleClick(realIDs);
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
