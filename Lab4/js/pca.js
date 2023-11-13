function parseCSVForPCA(csvString) {
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
function parseCSVForScree(csvString) {
  const arr = csvString.split(",");
  var sum = 0;
  for (var i = 0; i < arr.length; i++) {
    arr[i] = parseFloat(arr[i]);
    sum += arr[i];
  }
  for (var i = 0; i < arr.length; i++) {
    arr[i] /= sum;
    arr[i] *= 100;
  }
  return arr;
}

function plotPCA(data) {
  createScatter(data);
}
function plotScree(data) {
  createHist(data);
}
function createScatter(data) {
  const dim = {
    width: 540 - 80 - 40,
    height: 540 - 60 - 30,
    top: 60,
    right: 40,
    bottom: 30,
    left: 80,
  };
  const svg = d3
    .select("#pca")
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
    .attr("transform", "translate(0," + yScale(0) + ")")
    .call(xAxis);
  svg
    .append("g")
    .attr("transform", "translate(" + xScale(0) + ",0)")
    .call(yAxis);
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
  var x_label = "PC1";
  var y_label = "PC2";

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -dim.left + 70)
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
    .text(x_label + " vs. " + y_label + " Scatter Plot")
    .style("font-size", 14)
    .style("font-weight", "bold");
}

function createHist(data) {
  const dim = {
    width: 540,
    height: 540,
    mTop: 60,
    mBottom: 30,
    mLeft: 20,
    mRight: 20,
  };
  var xScale = d3
    .scaleBand()
    .range([dim.mLeft, dim.width - dim.mRight])
    .padding(0.5)
    .domain([0, data.length]);
  var yScale = d3
    .scaleLinear()
    .range([dim.height - dim.mBottom, dim.mTop])
    .domain([0, d3.max(data, (d) => d)]);

  const svg = d3
    .select("#scree")
    .append("svg")
    .attr("width", dim.width)
    .attr("height", dim.height)
    .attr("style", "max-width: 100%; height: auto;");
  var g = svg
    .append("g")
    .attr("transform", "translate(" + 50 + "," + -30 + ")");

  xScale.domain(data);
  yScale.domain([0, 100]);

  g.append("g")
    .attr("transform", "translate(0," + dim.height + ")")
    .call(
      d3.axisBottom(xScale).tickFormat(function (d, idx) {
        return "PC: " + (idx + 1);
      })
    );

  g.append("g")
    .attr("transform", "translate(" + dim.mLeft + "," + dim.mBottom + ")")
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          return d;
        })
        .ticks(4)
    );

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return xScale(d);
    })
    .attr("fill", "#1E90FF")
    .attr("y", function (d) {
      return yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return dim.height - yScale(d);
    });
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", dim.width / 2 - dim.mLeft)
    .attr("y", 50)
    .text("Scree Plot")
    .style("font-size", 14)
    .style("font-weight", "bold");

  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -dim.mLeft + 50)
    .attr("x", -dim.mTop - dim.height / 2)
    .text("Percentage (%)")
    .style("font-size", 11)
    .style("font-weight", "bold");
}
