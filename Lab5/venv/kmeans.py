import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt 
arr = np.loadtxt("data/data.csv", delimiter=",", dtype=str)
data = {arr[0,0]: arr[1:,0],
        arr[0,2]: arr[1:,2],arr[0,3]: arr[1:,3],
        arr[0,4]: arr[1:,4],arr[0,5]: arr[1:,5],
        arr[0,6]: arr[1:,6],arr[0,7]: arr[1:,7],
        arr[0,8]: arr[1:,8],arr[0,9]: arr[1:,9],
        arr[0,10]: arr[1:,10],arr[0,11]: arr[1:,11],
        arr[0,12]: arr[1:,12],arr[0,13]: arr[1:,13]}

df = pd.DataFrame(data, columns=[arr[0,0],arr[0,2],arr[0,3],arr[0,4],arr[0,5],arr[0,6],arr[0,7],arr[0,8],arr[0,9],arr[0,10],arr[0,11],arr[0,12],arr[0,13]])
scaler = StandardScaler()
scaler.fit(df.to_numpy())
X=scaler.transform(df.to_numpy()) 
kmeans = KMeans(n_clusters = 6).fit(X)
centroids = kmeans.cluster_centers_
pred_clusters = kmeans.predict(X)
np.array(pred_clusters).tofile("data/clusters.csv", sep=',')
def calculate_WSS(points, kmax):
  sse = []
  names = []
  for k in range(1, kmax+1):
    kmeans = KMeans(n_clusters = k).fit(points)
    centroids = kmeans.cluster_centers_
    pred_clusters = kmeans.predict(points)
    curr_sse = 0
    # calculate square of Euclidean distance of each point from its cluster center and add to current WSS
    for i in range(len(points)):
      curr_center = centroids[pred_clusters[i]]
      sse_tot = 0
      for j in range(len(curr_center)):
            sse_tot += (points[i, j] - curr_center[j]) ** 2 
      curr_sse += sse_tot
    names.append(str(k))
    sse.append(curr_sse / len(points))
  return sse, names
sse, names  = calculate_WSS(X, 20)

plt.bar(names, sse, color ='maroon', 
        width = 0.4)
plt.xlabel("K clusters")
plt.ylabel("Mean Square Error")
plt.title("Mean Square Error for K clusters [1:20]")
plt.show()