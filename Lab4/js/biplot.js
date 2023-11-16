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
  console.log(points);
  return points;
}
function graphBiplot(data, lineData, cluster_data) {
  const dim = {
    width: 800 - 80 - 150,
    height: 540 - 60 - 30,
    top: 60,
    right: 150,
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
  for(var i = 0; i < data.length; i++){
    data[i]["cluster"] = cluster_data[i];
  }
  
  var colors = ["#001219", "#94d2bd", "#e9d8a6", "#ee9b00", "#e56b6f", "#57cc99", "#967aa1", "#4393c3", "#2166ac"]
    
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .style("fill", function(d){
      return colors[d["cluster"]];
    }).attr("cx", function (d) {
      return xScale(parseFloat(d.x));
    })
    .attr("cy", function (d) {
      return yScale(parseFloat(d.y));
    })
    .attr("r", 3)
    ;
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
    svg
      .append("text")
      .attr("x", function () {
        if(line.name =="GoalsAgainstPer90"){
          return xScale(line.x) - 100;
        }else if(line.name =="TotalWins"){
          return xScale(line.x) + 100;
        }else if(line.name =="Posession"){

        }else if(line.name =="GoaliePassesLaunch%"){
          return xScale(line.x) - 100;
        }else if(line.name =="StandardSh/90"){
          return xScale(line.x) + 40;
        }else if(line.name =="GoalsAgainstPer90"){

        }
        return xScale(line.x);
      })
      .attr("y", function () {
        if (line.name == "TotalPassCmp%") {
          return yScale(line.y) - 13;
        }else if(line.name =="StandardSh/90"){
          return yScale(line.y) + 17;
        }else if(line.name == "TeamSuccess(xG)xG+/-90"){
          return yScale(line.y) + 10
        }
        else if(line.name == "StandardSoT/90"){
          return yScale(line.y) + 17
        }
        else if(line.name == "Posession"){
          return yScale(line.y) - 4
        }else if(line.name == "GoalieSave%"){
          return yScale(line.y) + 9
        }
        return yScale(line.y);
      })
      .text(line.name)
      .style("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "bold");
  });
}
