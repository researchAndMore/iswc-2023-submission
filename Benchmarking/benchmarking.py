import requests
import time as TIMER
import io
import csv
import urllib.parse

def main():
    test_result = benchmark()
    save_to_csv(test_result)


def benchmark():
    """
    performs benchmarking
    """
    test_results = {}
    for query in range(len(queries)):
        query_results = {}
        query_results['name'] = query
        for repo in repositories:
            repo_results = {}
            url = URL + repo + QUERY_BASE + urllib.parse.quote(queries[query])
            start_time = TIMER.time()
            response = requests.get(url)
            end_time = TIMER.time()
            # Use io.StringIO to create a file-like object from the response content
            csv_data = io.StringIO(response.content.decode('utf-8'))
            # Use csv.DictReader to parse the CSV data into a list of dictionaries
            reader = csv.DictReader(csv_data)
            # Convert the list of dictionaries into a single dictionary
            data_dict = {}
            for row in reader:
                key = row.pop(list(row.keys())[0])  # Assume the first column is the key
                data_dict[key] = row
            data = len(data_dict)
            time = end_time - start_time
            repo_results['no_responses'] = data
            repo_results['time'] = time
            repo_results['name'] = repo
            query_results[repo] = repo_results

        test_results[query] = query_results
    return test_results

def save_to_csv(test_results):
    """
    take test results and save it to a csv file
    """
    file = ""
    for query in range(len(queries)):
        results = test_results[query]
        for repo in repositories:
            result = results[repo]
            line = str(query) + ";" + str(result['name']) + ";" + str(result['time']) +";" + str(result['no_responses'])
            file = file + line + "\n"
    # Open the CSV file in 'write' mode
    with open('test_results.csv', mode='w', newline='') as file_object:

        # Create a CSV writer object
        writer = csv.writer(file_object)

        # Split the string into lines and write each line to the file
        for line in file.splitlines():
            writer.writerow(line.split(';'))




# inferring ground statements about the SPARQL-query
QUERY_BASE = '?infer=true&sameAs=true&query='

"""
test queries in the following order:
1. the base case according to the specification --> base case
2. reducing the number of query result by making the description more accurate --> reduce # of results
3. instead of taking a specific city (e.g. Paris), take France instead --> more likely geography
4. remove the bGeographyParent feature --> exact geography
5. remove the ranking calculation --> disable ranking
"""
queries = ["""
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX : <https://purl.org/wiser#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX gn: <http://www.geonames.org/ontology#>

select distinct ?act ?actName ?countryCode ((COUNT (DISTINCT ?childCounter)) - 1 AS ?ranking) WHERE {
	?act a :BActivity.
    ?act rdfs:label ?actName.
    ?act :bGeography ?geo.
    ?geo :bGeographyTerm ?countryCode.
    ?filter (:bGeographyParent)* ?parent.
    ?parent :bGeographyTerm ?countryCode.
    OPTIONAL{
        ?childCounter (:bGeographyParent)* ?parent.
        ?filter (:bGeographyParent)* ?childCounter.
    }
	FILTER(?filter = <https://sws.geonames.org/2988507/>)
    filter(regex(?actName, "Water treatment and distribution"))
    }
    GROUP BY ?act ?actName ?countryCode 
    ORDER BY ASC(?ranking)
    """,
    """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX : <https://purl.org/wiser#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX gn: <http://www.geonames.org/ontology#>

    select distinct ?act ?actName ?countryCode ((COUNT (DISTINCT ?childCounter)) - 1 AS ?ranking) WHERE {
        ?act a :BActivity.
        ?act rdfs:label ?actName.
        ?act :bGeography ?geo.
        ?geo :bGeographyTerm ?countryCode.
        ?filter (:bGeographyParent)* ?parent.
        ?parent :bGeographyTerm ?countryCode.
        OPTIONAL{
            ?childCounter (:bGeographyParent)* ?parent.
            ?filter (:bGeographyParent)* ?childCounter.
        }
        FILTER(?filter = <https://sws.geonames.org/2988507/>)
        filter(regex(?actName, "Water treatment and distribution v1.3"))
    }
    GROUP BY ?act ?actName ?countryCode 
    ORDER BY ASC(?ranking)
    """,
    """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX : <https://purl.org/wiser#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX gn: <http://www.geonames.org/ontology#>

    select distinct ?act ?actName ?countryCode ((COUNT (DISTINCT ?childCounter)) - 1 AS ?ranking) WHERE {
        ?act a :BActivity.
        ?act rdfs:label ?actName.
        ?act :bGeography ?geo.
        ?geo :bGeographyTerm ?countryCode.
        ?filter (:bGeographyParent)* ?parent.
        ?parent :bGeographyTerm ?countryCode.
        OPTIONAL{
            ?childCounter (:bGeographyParent)* ?parent.
            ?filter (:bGeographyParent)* ?childCounter.
        }
        FILTER(?filter = <https://sws.geonames.org/3017382/>)
        filter(regex(?actName, "Water treatment and distribution"))
    }
    GROUP BY ?act ?actName ?countryCode 
    ORDER BY ASC(?ranking)
    """,
    """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX : <https://purl.org/wiser#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX gn: <http://www.geonames.org/ontology#>

    select distinct ?act ?actName ?countryCode WHERE {
        ?act a :BActivity.
        ?act rdfs:label ?actName.
        ?act :bGeography ?geo.
        ?geo :bGeographyTerm ?countryCode.
        ?filter :bGeographyTerm ?countryCode.
        FILTER(?filter = <https://sws.geonames.org/3017382/>)
        filter(regex(?actName, "Water treatment and distribution"))
    }
    GROUP BY ?act ?actName ?countryCode 
    ORDER BY ASC(?ranking)
    """,
    """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX : <https://purl.org/wiser#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX gn: <http://www.geonames.org/ontology#>

    select distinct ?act ?actName ?countryCode WHERE {
        ?act a :BActivity.
        ?act rdfs:label ?actName.
        ?act :bGeography ?geo.
        ?geo :bGeographyTerm ?countryCode.
        ?filter (:bGeographyParent)* ?parent.
        ?parent :bGeographyTerm ?countryCode.
        FILTER(?filter = <https://sws.geonames.org/3017382/>)
        filter(regex(?actName, "Water treatment and distribution"))
    }
    GROUP BY ?act ?actName ?countryCode 
    ORDER BY ASC(?ranking)
    """
            ]

"""
for this benchmarking tests, a series of repositories was set up in order to be able 
to evaluate different data base sizes. Please find the exported repositories in this folder as well.
"""
repositories = ['10_000entries', '20_000entries', '50_000entries', '100_000_entries', 
                '200_000_entries', '400_000entries', '600_000entries']


# link to the locally hosted GraphDB, v10.2.0
URL = 'http://localhost:7200/repositories/'

if __name__ == "__main__":
    main()