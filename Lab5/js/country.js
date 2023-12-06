function createCountryStats(data) {
  // Y axis
  var names = {};
  var n = [];
  for (var i = 0; i < data.length; i++) {
    var country = data[i].Squad.substring(0, 2);
    if (country in names) {
      names[country].count = names[country].count + 1;
    } else {
      names[country] = { country: country, count: 1 };
      n.push(country);
    }
  }
  var data = [];
  for (var key in names) {
    data.push(names[key]);
  }
  data.sort(function (x, y) {
    if (x.count < y.count) {
      return 1;
    }
    if (x.count > y.count) {
      return -1;
    }
    return 0;
  });
  const dim = {
    width: 740,
    height: 740,
    mTop: 60,
    mBottom: 30,
    mLeft: 100,
    mRight: 20,
  };
  var svg = d3
    .select("#country")
    .append("svg")
    .attr("width", dim.width + dim.mLeft + dim.mRight)
    .attr("height", dim.height + dim.mTop + dim.mBottom)
    .append("g")
    .attr("transform", "translate(" + dim.mLeft + "," + dim.mTop + ")");
  var x = d3.scaleLinear().domain([0, 75]).range([0, dim.width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + dim.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  var y = d3
    .scaleBand()
    .range([0, dim.height])
    .domain(
      data.map(function (d) {
        return convertToLong(d.country);
      })
    )
    .padding(0.1);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0))
    .attr("y", function (d) {
      return y(convertToLong(d.country));
    })
    .attr("width", function (d) {
      return x(d.count);
    })
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2");
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
