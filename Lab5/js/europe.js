function groupByCountry(data) {
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
  return data;
}

function drawEurope(fullData, geoData) {
  // Setting up the svg element for D3 to draw in
  let width = 800,
    height = 600;
  var parsedData = groupByCountry(fullData);
  let svg = d3
    .select("#europe")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  let europeProjection = d3
    .geoMercator()
    .center([15, 56])
    .scale([width / 1.5])
    .translate([width / 2, height / 2]);

  // The path generator uses the projection to convert the GeoJSON
  // geometry to a set of coordinates that D3 can understand
  let pathGenerator = null;

  // URL to the GeoJSON itself
  let geoJsonUrl = "";

  pathGenerator = d3.geoPath().projection(europeProjection);
  geoJsonUrl =
    "https://gist.githubusercontent.com/spiker830/3eab0cb407031bf9f2286f98b9d0558a/raw/7edae936285e77be675366550e20f9166bed0ed5/europe_features.json";
  console.log(JSON.parse(geoData));
  // Request the GeoJSON
  d3.json(geoJsonUrl, function (geojson) {
    console.log(geojson);
    // Tell D3 to render a path for each GeoJSON feature
    // for (var i = 0; i < geojson.features.length; i++) {
    //   console.log(geojson.features[i].properties.name);
    // }
    var colorRange = d3
      .scaleLinear()
      .domain([
        1,
        d3.max(parsedData, function (d) {
          return d.count;
        }),
      ])
      .range(["#73c2fb", "#002366"]);
    svg
      .selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", pathGenerator) // This is where the magic happens
      .attr("stroke", "black") // Color of the lines themselves
      .attr("fill", function (d) {
        var name = d.properties.name;
        var short = convertToShort(name);
        if (short.length > 0 && short != null && short !== "") {
          return colorRange(findObject(parsedData, short).count);
        }
        return "white";
      }); // Color uses to fill in the lines
  });
}
function findObject(arr, name) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].country == name) {
      return arr[i];
    }
  }
}
function convertToShort(ab) {
  switch (ab) {
    case "Spain":
      return "es";
    case "Germany":
      return "de";
    case "Italy":
      return "it";
    case "United Kingdom":
      return "en";
    case "France":
      return "fr";
    case "Portugal":
      return "pt";
    case "Ukraine":
      return "ua";
    case "Russia":
      return "ru";
    case "Netherlands":
      return "nl";
    case "Belgium":
      return "be";
    case "Turkey":
      return "tr";
    case "Austria":
      return "at";
    case "Switzerland":
      return "ch";
    case "Greece":
      return "gr";
    case "Czech Republic":
      return "cz";
    case "Sweden":
      return "se";
    case "Moldova":
      return "md";
    case "Serbia":
      return "rs";
    case "Croatia":
      return "hr";
    case "Denmark":
      return "dk";
    case "United Kingdom":
      return "sc";
    case "Hungary":
      return "hu";
    case "Israel":
      return "il";
  }
  return "";
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
