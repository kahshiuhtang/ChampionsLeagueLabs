function parseCSVForPCD(csvString) {
  var data = [];
  const lines = csvString.split("\n");
  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    var line = lines[i];
    const values = line.split(",");
    var tObj = {};
    for (var j = 1; j < values.length; j++) {
      tObj[headers[j]] = values[j];
    }
    data.push(tObj);
  }
  return data;
}
function plotPCD(data) {
  var margin = { top: 75, right: 75, bottom: 75, left: 75 },
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  var svg = d3
    .select("#pcd")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  dataFieldNames = d3.keys(data[0]);
  var y = {};
  for (i in dataFieldNames) {
    var name = dataFieldNames[i];
    y[name] = d3
      .scaleLinear()
      .domain(
        d3.extent(data, function (d) {
          return +d[name];
        })
      )
      .range([height, 0]);
  }

  x = d3.scalePoint().range([0, width]).padding(1).domain(dataFieldNames);

  function drawLine(d) {
    return d3.line()(
      dataFieldNames.map(function (p) {
        return [x(p), y[p](d[p])];
      })
    );
  }

  svg
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", drawLine)
    .style("fill", "none")
    .style("stroke", "#1E90FF")
    .style("opacity", 0.6);
  svg
    .selectAll("axis")
    .data(dataFieldNames)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    })
    .each(function (d) {
      d3.select(this).call(d3.axisLeft().scale(y[d]));
    })
    .append("text")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .attr("y", -9)
    .text(function (d) {
      return d;
    })
    .style("fill", "black");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.top - 20)
    .text("Parallel Coordinate Display")
    .style("font-size", "20px")
    .style("font-weight", "bold");
}
