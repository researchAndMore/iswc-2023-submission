# Competency Questions

| Question     | Expected Answer                                                                                   |
| -------- | --------------------------------------------------------------------------------------------- |
| Can a list of all geographies available in the KG graph be obtained?  | Returns a list of all available valid geographies. |
| Given any region in the world: What are the available datasets in the KG that apply to this region? | Returns a list of all available datasets in the KG, which are applicable to the given region. If for example a city is given datasets from this city, it corresponding country as well as continent and also the world should be returned. |
| Given the results from CQ2, how geographically accurate are the found datasets with respect to the user search? | Should return a ranking index for each dataset retrieved by CQ2, where the lower ranking, the more exact the dataset is referencing the given geography.  |
| What are the available datasets that contain a specific description? | Should return all datasets which have a description that contain this specific description.  |
