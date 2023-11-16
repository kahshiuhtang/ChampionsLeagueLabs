function parseCluster(data){
    var ans = [];
    var clusters = data.split(",");
    for(var i = 0; i < clusters.length; i++){
        ans.push(parseFloat(clusters[i]));
    }
    return ans;
}