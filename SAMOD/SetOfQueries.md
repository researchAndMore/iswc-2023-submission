# Set of Queries

## CQ1: Can a list of all geographies available in the KG graph be obtained?
```sparql
PREFIX : <https://purl.org/wiser#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select distinct ?WISERGeography
    WHERE {
    ?WISERGeography a :WISERGeography.
}
```
Tested with Protegé.

## CQ2: Given any region in the world: What are the available datasets in the KG that apply to this region? 
```sparql
PREFIX : <https://purl.org/wiser#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select distinct ?activity ?activityName ?geographyTerm
    WHERE {
    ?activity a :BActivity.
    ?activity rdfs:label ?activityName.
    ?activity :bGeography ?geogeography.
    ?geography :bGeographyTerm ?geographyTerm.
    ?filter (:bGeographyParent)* ?parent.
    ?parent :bGeographyTerm ?geographyTerm.
    #region of St. Gallen (region in Switzerland)
	FILTER(?filter = <https://sws.geonames.org/2988507/>)
    FILTER(REGEX(?activityName, "Part of Activity Description"))
}
GROUP BY ?activity ?actvityName ?geographyTerm 
ORDER BY ASC(?ranking)
```
Tested with Protegé and GraphDB v10.2.0

## CQ3: Given the results from CQ2, how geographically accurate are the found datasets with respect to the user search?
```sparql
PREFIX : <https://purl.org/wiser#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select distinct ?activity ?activityName 
    ?geographyTerm ((COUNT (DISTINCT ?childCounter)) - 1 AS ?ranking) 
    WHERE {
    ?activity a :BActivity.
    ?activity rdfs:label ?activityName.
    ?activity :bGeography ?geogeography.
    ?geography :bGeographyTerm ?geographyTerm.
    ?filter (:bGeographyParent)* ?parent.
    ?parent :bGeographyTerm ?geographyTerm.
    OPTIONAL{
        ?childCounter (:bGeographyParent)* ?parent.
        ?filter (:bGeographyParent)* ?childCounter.
    }
    #region of St. Gallen (region in Switzerland)
	FILTER(?filter = <https://sws.geonames.org/2988507/>)
}
GROUP BY ?activity ?actvityName ?geographyTerm 
ORDER BY ASC(?ranking)
```
Tested with Protegé and GraphDB v10.2.0

## CQ4: What are the available datasets that contain a specific description (including all the questions above)?
```sparql
PREFIX : <https://purl.org/wiser#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

select distinct ?activity ?activityName 
    ?geographyTerm ((COUNT (DISTINCT ?childCounter)) - 1 AS ?ranking) 
    WHERE {
    ?activity a :BActivity.
    ?activity rdfs:label ?activityName.
    ?activity :bGeography ?geogeography.
    ?geography :bGeographyTerm ?geographyTerm.
    ?filter (:bGeographyParent)* ?parent.
    ?parent :bGeographyTerm ?geographyTerm.
    OPTIONAL{
        ?childCounter (:bGeographyParent)* ?parent.
        ?filter (:bGeographyParent)* ?childCounter.
    }
    #region of St. Gallen (region in Switzerland)
	FILTER(?filter = <https://sws.geonames.org/2988507/>)
    FILTER(REGEX(?activityName, "Dataset Description"))
}
GROUP BY ?activity ?actvityName ?geographyTerm 
ORDER BY ASC(?ranking)
```
Tested with Protegé and GraphDB v10.2.0
