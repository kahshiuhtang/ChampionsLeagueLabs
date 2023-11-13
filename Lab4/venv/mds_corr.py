import numpy as np
import pandas as pd
from sklearn.manifold import MDS
arr = np.loadtxt("data/data.csv", delimiter=",", dtype=str)
data = {arr[0,0]: arr[1:,0],
        arr[0,2]: arr[1:,2],arr[0,3]: arr[1:,3],
        arr[0,4]: arr[1:,4],arr[0,5]: arr[1:,5],
        arr[0,6]: arr[1:,6],arr[0,7]: arr[1:,7],
        arr[0,8]: arr[1:,8],arr[0,9]: arr[1:,9],
        arr[0,10]: arr[1:,10],arr[0,11]: arr[1:,11],
        arr[0,12]: arr[1:,12],arr[0,13]: arr[1:,13]}

df = pd.DataFrame(data, columns=[arr[0,0],arr[0,2],arr[0,3],arr[0,4],arr[0,5],arr[0,6],arr[0,7],arr[0,8],arr[0,9],arr[0,10],arr[0,11],arr[0,12],arr[0,13]])
matrix = df.corr()
matrix = matrix.apply(lambda val: 1- val)
mds = MDS(n_components=2, normalized_stress='auto', dissimilarity='precomputed')
X_trans = mds.fit_transform(matrix)
print(np.array(X_trans).tofile("data/mds_corr.csv", sep = ','))