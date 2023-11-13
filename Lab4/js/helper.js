function parseBasicCSV(csvString) {
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
function createMainHistogram(allData) {
  document.getElementById("starting-bar").innerHTML = "";
  var varName = document.getElementById("variable-select").value;
  var data = [];
  for (var i = 0; i < allData.length; i++) {
    data.push(parseFloat(allData[i][varName]));
  }
  const dim = {
    width: 540,
    height: 540,
    top: 60,
    bottom: 30,
    left: 20,
    right: 20,
  };
  var svg = d3
    .select("#starting-bar")
    .append("svg")
    .attr("width", dim.width + dim.left + dim.right)
    .attr("height", dim.height + dim.top + dim.bottom)
    .append("g")
    .attr("transform", "translate(" + dim.left + "," + dim.top + ")");
  var x = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, function (d) {
        return d;
      }),
    ])
    .range([0, dim.width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + dim.height + ")")
    .call(d3.axisBottom(x));
  var histogram = d3
    .histogram()
    .value(function (d) {
      return d;
    })
    .domain(x.domain())
    .thresholds(x.ticks(8));

  var bins = histogram(data);
  var y = d3.scaleLinear().range([dim.height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); 
  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      console.log(y(d.length));
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })
    .attr("width", function (d) {
      return x(d.x1) - x(d.x0) - 1;
    })
    .attr("height", function (d) {
      return dim.height - y(d.length);
    }).
    on("click", function(d) {
        console.log(d)
    })
    .style("fill", "#69b3a2");
}
