function parseDataForWinsHist(csvString) {
  var data = [];
  const lines = csvString.split("\n");
  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    var line = lines[i];
    const values = line.split(",");
    var tObj = {};
    for (var j = 0; j < values.length; j++) {
      tObj[headers[j]] = parseFloat(values[j]);
    }
    data.push(tObj);
  }
  var ans = [];
  for (var i = 0; i < data.length; i++) {
    ans.push(data[i].TotalWins);
  }
  console.log(ans);
  return ans;
}
function parseFullData(csvString) {
  var data = [];
  const lines = csvString.split("\n");
  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    var line = lines[i];
    const values = line.split(",");
    var tObj = {};
    for (var j = 1; j < values.length; j++) {
      tObj[headers[j]] = parseFloat(values[j]);
    }
    data.push(tObj);
  }
  return data;
}
function parseFullDataForCountry(csvString) {
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

function createWinsHist(data, clickHandler) {
  const dim = {
    width: 340,
    height: 340,
    mTop: 60,
    mBottom: 40,
    mLeft: 70,
    mRight: 20,
  };
  var svg = d3
    .select("#wins")
    .append("svg")
    .attr("width", dim.width + dim.mLeft + dim.mRight)
    .attr("height", dim.height + dim.mTop + dim.mBottom)
    .append("g")
    .attr("transform", "translate(" + dim.mLeft + "," + dim.mTop + ")");
  // X axis: scale and draw:
  var x = d3
    .scaleLinear()
    .domain([0, 12]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
    .range([0, dim.width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + dim.height + ")")
    .call(d3.axisBottom(x));
  // set the parameters for the histogram
  var histogram = d3
    .histogram()
    .value(function (d) {
      return d.TotalWins;
    }) // I need to give the vector of value
    .domain(x.domain()) // then the domain of the graphic
    .thresholds(x.ticks(12)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear().range([dim.height, 0]);
  y.domain([
    0,
    d3.max(bins, function (d) {
      return d.length;
    }),
  ]); // d3.hist has to be called before the Y axis obviously
  svg.append("g").call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    .attr("transform", function (d) {
      return "translate(" + x(d.x0) + "," + y(d.length) + ")";
    })
    .attr("width", function (d) {
      return x(d.x1) - x(d.x0) - 1;
    })
    .attr("height", function (d) {
      return dim.height - y(d.length);
    })
    .style("fill", "#d0c8d6")
    .on("click", function (d) {
      var s = new Set();
      for (var i = 0; i < d.length; i++) {
        s.add(d[i]["StandardSh/90"] + "," + d[i]["GoalieSave%"]);
      }
      var clicked = clickHandler(d, bins, s);
      if (clicked == true) {
        d3.select(this).style("fill", "#d0c8d6");
      } else {
        d3.select(this).style("fill", "#a64d79");
      }
    });
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", -dim.mLeft + 20)
    .attr("x", -dim.mTop - dim.height / 2 + 30)
    .text("Count (# Teams)")
    .style("font-size", "14px")
    .style("fill", "white");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", dim.width / 2)
    .attr("y", dim.height + dim.mBottom - 5)
    .text("Wins")
    .style("font-size", "14px")
    .style("fill", "white");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", dim.width / 2)
    .attr("y", -5)
    .text("Wins Histogram (Teams)")
    .style("font-size", "14px")
    .style("fill", "white");
}

function convertToLong(ab) {
  switch (ab) {
    case "es":
      return "Spain";
    case "de":
      return "Germany";
    case "it":
      return "Italy";
    case "en":
      return "United Kingdom";
    case "fr":
      return "France";
    case "pt":
      return "Portugal";
    case "ua":
      return "Ukraine";
    case "ru":
      return "Russia";
    case "nl":
      return "Netherlands";
    case "be":
      return "Belgium";
    case "tr":
      return "Turkey";
    case "at":
      return "Austria";
    case "ch":
      return "Switzerland";
    case "gr":
      return "Greece";
    case "cz":
      return "Czech Republic";
    case "se":
      return "Sweden";
    case "md":
      return "Moldova";
    case "rs":
      return "Serbia";
    case "hr":
      return "Croatia";
    case "dk":
      return "Denmark";
    case "sc":
      return "United Kingdom";
    case "hu":
      return "Hungary";
    case "il":
      return "Israel";
  }
  return "";
}
