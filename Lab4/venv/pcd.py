import numpy as np
import pandas as pd
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
max = -1
firstInd = -1
secondInd = -1
new_mat = matrix.to_numpy()
for i in range(0, len(new_mat)):
    for j in range(0, len(new_mat)):
        if abs(new_mat[i][j]) > max and i != j:
            max = abs(new_mat[i][j])
            firstInd = i
            secondInd = j
            print(max)
ordering = [firstInd, secondInd]

prevInd = secondInd
for i in range(0, len(new_mat) - 2):
    highestCorrInd = -1
    highestCorr = -1
    for j in range(0, len(new_mat[1])):
        if j not in ordering and abs(new_mat[prevInd][j]) > highestCorr:
            highestCorr = abs(new_mat[prevInd][j]) 
            highestCorrInd = j
    ordering.append(highestCorrInd)
    prevInd = highestCorrInd
new_df = []
for i, idx in enumerate(ordering):
    new_df.append(df.iloc[:,idx])
df = pd.DataFrame(new_df).T
df = df.iloc[:,::-1]
print(df)
df.to_csv("data/pcd_data.csv")