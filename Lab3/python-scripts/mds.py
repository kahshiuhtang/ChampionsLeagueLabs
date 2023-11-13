import numpy as np
import pandas as pd
from sklearn.manifold import MDS
from sklearn.preprocessing import StandardScaler
arr = np.loadtxt("data/data.csv", delimiter=",", dtype=str)
data = {arr[0,2]: arr[1:,2],arr[0,3]: arr[1:,3],arr[0,4]: arr[1:,4],arr[0,5]: arr[1:,5],arr[0,8]: arr[1:,8],arr[0,9]: arr[1:,9],arr[0,11]: arr[1:,11],arr[0,13]: arr[1:,13]}

df = pd.DataFrame(data, columns=[arr[0,2],arr[0,3],arr[0,4],arr[0,5],arr[0,8],arr[0,9],arr[0,11],arr[0,13]])
mds = MDS(n_components=2, normalized_stress='auto')
scaler = StandardScaler()
scaler.fit(df.to_numpy())
X=scaler.transform(df.to_numpy()) 
X_trans = mds.fit_transform(X)
#X_trans.tofile('data/mds_eucl.csv', sep = ',')
print(X_trans)
df = pd.DataFrame(X_trans, columns = ['X', 'Y'])
df.to_csv('data/mds_eucl.csv')