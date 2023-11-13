import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
arr = np.loadtxt("data/data.csv", delimiter=",", dtype=str)
data = {arr[0,0]: arr[1:,0],
        arr[0,2]: arr[1:,2],arr[0,3]: arr[1:,3],
        arr[0,4]: arr[1:,4],arr[0,5]: arr[1:,5],
        arr[0,6]: arr[1:,6],arr[0,7]: arr[1:,7],
        arr[0,8]: arr[1:,8],arr[0,9]: arr[1:,9],
        arr[0,10]: arr[1:,10],arr[0,11]: arr[1:,11],
        arr[0,12]: arr[1:,12],arr[0,13]: arr[1:,13]}

df = pd.DataFrame(data, columns=[arr[0,0],arr[0,2],arr[0,3],arr[0,4],arr[0,5],arr[0,6],arr[0,7],arr[0,8],arr[0,9],arr[0,10],arr[0,11],arr[0,12],arr[0,13]])
cols = 2
scaler = StandardScaler()
scaler.fit(df.to_numpy())
X=scaler.transform(df.to_numpy())   
pca = PCA(n_components=cols)
pca.fit(X)
X = pca.transform(X)
X.tofile('data/pca.csv', sep = ',')
print(pd.DataFrame(X).to_csv('data/pca.csv'))
#pca.explained_variance_.tofile('data/pca_full.csv', sep = ',')
print(pca.explained_variance_)