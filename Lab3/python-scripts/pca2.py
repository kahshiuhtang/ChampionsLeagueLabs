import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
arr = np.loadtxt("data/data.csv", delimiter=",", dtype=str)
data = {arr[0,2]: arr[1:,2],arr[0,3]: arr[1:,3],arr[0,4]: arr[1:,4],arr[0,5]: arr[1:,5],arr[0,8]: arr[1:,8],arr[0,9]: arr[1:,9],arr[0,11]: arr[1:,11],arr[0,13]: arr[1:,13]}

df = pd.DataFrame(data, columns=[arr[0,2],arr[0,3],arr[0,4],arr[0,5],arr[0,8],arr[0,9],arr[0,11],arr[0,13]])
scaler = StandardScaler()
scaler.fit(df)
df_scaled = scaler.transform(df)
pca = PCA(n_components=2)
pc = pd.DataFrame(pca.fit_transform(df_scaled),
               columns = ['PC1', 'PC2'])
max1 = pc.PC1.max()
max2 = pc.PC2.max()
min1 = pc.PC1.min()
min2 = pc.PC2.min()
pc.PC1 = pc.PC1.apply(lambda x: x / (max1 - min1))
pc.PC2 = pc.PC2.apply(lambda x: x / (max2 - min2))
loadings = pd.DataFrame(pca.components_.T, columns=['PC1', 'PC2'], 
                        index=df.columns)
pc.to_csv("data/pca.csv")
loadings.to_csv("data/biplot.csv")
print(loadings)