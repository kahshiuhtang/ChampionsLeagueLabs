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
/*
      ,PC1,PC2
Year,0.013774492596563246,0.5758430841217149
Posession,0.3787455858893921,0.0025023633900104203
GoalsAgainstPer90,-0.3156135403461997,-0.009127385373558495
GoalieSave%,0.13853093068965186,-0.0336729996553402
TotalWins,0.3166292257932884,-0.0003690813461093203
GoalieLaunchedComp%,0.09098903672811912,-0.20963353963804415
GoaliePassesLaunch%,-0.30933518078084665,-0.08424855007435816
StandardSh/90,0.3583901917653463,-0.038089281303056624
StandardSoT/90,0.35536782447284104,-0.0035926343228127947
TotalPassCmp%,0.3305969941390473,0.011082797642609485
ChallengesTkl%,0.0943443020218222,0.5079685365201552
Take-OnsSucc%,0.08681832415170904,-0.5970837079299748
TeamSuccess(xG)xG+/-90,0.39099300751431215,0.0030996903522004246
*/
function parseNames(name){
  if(name == "TotalPassCmp%"){
    return "PassCmp%"
  }else if(name == "GoalsAgainstPer90"){
    return "GoalsAgainst90"
  }
  else if(name == "Take-OnsSucc%"){
    return "TakeOnSucc%"
  }
  else if(name == "GoaliePassesLaunch%"){
    return "GPassLaunch%"
  }
  else if(name == "GoalieLaunchedComp%"){
    return "GLaunchComp%"
  }
  else if(name == "TeamSuccess(xG)xG+/-90"){
    return "xG +/-90"
  }
  return name;
}
function plotPCD(data, cluster_data) {
  var colors = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c","#e7c6ff"] 
  var margin = { top: 75, right: 75, bottom: 75, left: 75 },
    width = 1600 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  var svg = d3
    .select("#pcd")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var data1 =  JSON.parse(JSON.stringify(data[0]));
  delete data[0].cluster;
    dataFieldNames = d3.keys(data[0]);
    data[0] = data1;
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

  for(var i = 0; i < data.length; i++){
    data[i]["cluster"] = cluster_data[i];
  }
  var colors = ["#001219", "#94d2bd", "#e9d8a6", "#ee9b00", "#e56b6f", "#57cc99", "#967aa1", "#4393c3", "#2166ac","#54AD56"]
  
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
    .style("stroke", function(d){
      return colors[d.cluster];
    })
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
      return parseNames(d);
    })
    .style("fill", "white");
  svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.top - 20)
    .text("Parallel Coordinate Display")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("fill", "white");
}
