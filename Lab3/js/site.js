function handleGraph(buttonID) {
  document.getElementById("correlation-data").style.display = "none";
  document.getElementById("correlation-matrix").style.display = "none";
  document.getElementById("pcd").style.display = "none";
  document.getElementById("pca").style.display = "none";
  document.getElementById("scree").style.display = "none";
  document.getElementById("mds").style.display = "none";
  document.getElementById("scatter-5").style.display = "none";
  document.getElementById("biplot").style.display = "none";
  document.getElementById("mds-corr").style.display = "none";
  if (buttonID == "corr-but") {
    document.getElementById("correlation-matrix").style.display = "block";
  } else if (buttonID == "pcd-but") {
    document.getElementById("pcd").style.display = "block";
  } else if (buttonID == "scatter-but") {
    document.getElementById("scatter-5").style.display = "block";
  } else if (buttonID == "pca-but") {
    document.getElementById("pca").style.display = "block";
    document.getElementById("scree").style.display = "block";
  } else if (buttonID == "biplot-but") {
    document.getElementById("biplot").style.display = "block";
  } else if (buttonID == "mds-but") {
    document.getElementById("mds").style.display = "block";
  } else if (buttonID == "mds1-but") {
    document.getElementById("mds-corr").style.display = "block";
  }
}
