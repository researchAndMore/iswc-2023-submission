import rdflib
import random
import uuid
import time

"""
    Program to generate ABox triples for testing.
"""



def random_country():
    """
    Functions that generates a random country (geography term) out of the ABox countries
    """
    strings = ['CH', 'NL', 'AT', 'DE', 'RU', 'TU', 'FR', 'Europe, without Russia and Turkey', 'Europe without Switzerland', 'RER w/o CH+DE', 'WEU', 'Switzerland']
    return random.choice(strings)



def generate_lca_title():
    """
    Functions that generates a random text out of sample texts
    """
    # List of potential titles
    titles = ["Manufacturing of steel beams", "Production of plastic bags", "Transport of goods by truck", "Construction of office buildings", "Waste water treatment", 
              "Electricity production from natural gas", "Manufacturing of solar panels", "Recycling of paper products", "Agricultural production of tomatoes", "Mining of copper ore", 
              "Production of aluminum cans", "Transport of passengers by airplane", "Construction of single-family homes", "Water treatment and distribution", 
              "Electricity production from coal-fired power plants", "Manufacturing of wind turbine blades", "Recycling of plastic bottles", "Agricultural production of wheat", 
              "Mining of iron ore", "Manufacturing of automobiles", "Production of polyethylene", "Transport of goods by rail", "Construction of shopping centers", 
              "Production of nitrogen fertilizer", "Electricity production from nuclear power plants", "Manufacturing of airplane parts", "Recycling of glass products", 
              "Agricultural production of corn", "Mining of gold ore", "Manufacturing of home appliances", "Production of PVC pipes", "Transport of goods by ship", 
              "Construction of multi-family dwellings", "Production of phosphate fertilizer", "Electricity production from hydroelectric power plants", "Manufacturing of ship parts", 
              "Recycling of metal products", "Agricultural production of soybeans", "Mining of silver ore", "Manufacturing of computer components", "Production of polystyrene", 
              "Transport of goods by pipeline", "Construction of schools", "Production of potassium fertilizer", "Electricity production from wind turbines", 
              "Manufacturing of electronic devices", "Recycling of electronic waste", "Agricultural production of rice", "Mining of bauxite ore", "Manufacturing of furniture", 
              "Production of polycarbonate", "Transport of goods by barge", "Construction of hospitals", "Production of sulfuric acid", "Electricity production from biomass", 
              "Manufacturing of medical equipment", "Recycling of construction materials", "Agricultural production of potatoes", "Mining of lead ore", "Manufacturing of plastic pipes", 
              "Production of PET bottles", "Transport of passengers by train", "Construction of hotels", "Production of ammonia fertilizer", "Electricity production from geothermal power plants", 
              "Manufacturing of telecommunications equipment", "Recycling of organic waste", "Agricultural production of cotton", "Mining of nickel ore", "Manufacturing of lighting fixtures", 
              "Production of glass bottles", "Transport of passengers by bus", "Construction of sports facilities", "Production of phosphoric acid", "Electricity production from solar panels", 
              "Manufacturing of industrial machinery", "Recycling of hazardous waste", "Agricultural production of beef", "Mining of zinc ore", "Manufacturing of plastic toys", 
              "Production of polypropylene", "Transport of passengers by car", "Construction of museums", "Production of urea fertilizer", "Electricity production from tidal power", 
              "Manufacturing of pharmaceuticals", "Recycling of plastic film", "Agricultural production of pork", "Mining of tin ore", "Manufacturing of sports equipment", "Production of HDPE", 
              "Transport of passengers by bicycle", "Construction of airports", "Production of nitric acid","Office building construction", "Wind turbine production", 
              "Electric vehicle manufacturing", "Pulp and paper production", "Steel manufacturing", "Polymer production", "Textile dyeing", "Glass manufacturing", "Plastic packaging production", 
              "Biofuel production", "Aluminum recycling", "Cement production", "Lithium-ion battery production"]    
    
    # Shuffle the list of titles to generate a random ordering
    random.shuffle(titles)
    
    # Return the first num_titles titles from the shuffled list
    return titles[0]


def create_ecospold_triples(graph,RDFS_NAMESPACE, randomUUID, activity_name, geography_term):
    """
    Functions to add Ecopspold triples
    
    Parameters:
    - graph: The RDF graph to which the triples should be added.
    - RDFS_NAMESPACE: The RDF namespace for the RDFS vocabulary.
    - randomUUID: A randomly generated UUID that will be used to create a unique identifier for the Ecopspold activity.
    - activity_name: The name of the Ecopspold activity.
    - geography_term: The name of the geography associated with the Ecopspold activity.
    """
    
    ECOSPOLD_NAMESPACE = rdflib.Namespace('http://www.EcoInvent.org/EcoSpold02/metainformation#')
    ECOSPOLD_ACTIVITY_NAMESPACE = rdflib.Namespace('http://www.EcoInvent.org/EcoSpold02/activity#')
    activity = rdflib.URIRef(ECOSPOLD_NAMESPACE + str(randomUUID))

    # Add RDF triples to the graph
    graph.add((activity, rdflib.RDF.type, ECOSPOLD_NAMESPACE.TActivity))
    graph.add((activity, RDFS_NAMESPACE.label, rdflib.Literal(activity_name)))
    blank_node = rdflib.BNode()
    graph.add((activity, ECOSPOLD_ACTIVITY_NAMESPACE.geography, blank_node))
    country_literal = rdflib.Literal(geography_term)
    graph.add((blank_node, ECOSPOLD_NAMESPACE.shortName, country_literal))

def create_ILCD_triples(graph,RDFS_NAMESPACE, random_uuid, activity_name, geography_term):
    """
    Functions to add ILCD triples
    
    Parameters:
    - graph: The RDF graph to which the triples should be added.
    - RDFS_NAMESPACE: The RDF namespace for the RDFS vocabulary.
    - randomUUID: A randomly generated UUID that will be used to create a unique identifier for the Ecopspold activity.
    - activity_name: The name of the Ecopspold activity.
    - geography_term: The name of the geography associated with the Ecopspold activity.
    """
    ILCD_NAMESPACE = rdflib.Namespace('http://lca.jrc.it/ILCD/Process_Data_Set#')
    activity = rdflib.URIRef(ILCD_NAMESPACE + str(random_uuid))

    # Add RDF triples to the graph
    graph.add((activity, rdflib.RDF.type, ILCD_NAMESPACE.DataSetInformationType))
    graph.add((activity, RDFS_NAMESPACE.label, rdflib.Literal(activity_name)))
    blank_node = rdflib.BNode()
    graph.add((activity, ILCD_NAMESPACE.geography, blank_node))
    country_literal = rdflib.Literal(geography_term)
    graph.add((blank_node, ILCD_NAMESPACE.location, country_literal))


def main():
    """
    main function
    """
    # Create the RDF graph
    global_graph = rdflib.Graph()

    # Define the relevant RDF namespaces   
    RDFS_NAMESPACE = rdflib.Namespace('http://www.w3.org/2000/01/rdf-schema#')

    # Set the number of triples to generate
    NUMBERS_OF_DATA_SETS = 50_000
    FILENAME_BASE = "ABox_"+str(NUMBERS_OF_DATA_SETS)+"_"
    NUMBERS_OF_DATA_SETS = 50_000
    FILENAME_BASE = "ABox_"+str(NUMBERS_OF_DATA_SETS)+"_"

    # Generate and add RDF triples to the graph
    for idx in range(1, NUMBERS_OF_DATA_SETS):
        # Randomly choose whether to use EcoSpold or ILCD namespace
        is_ecospold = random.choice([True, False])

        # Generate a label for the activity, versionized in order to have unique names for testing
        activity_name = "LCA " + generate_lca_title() + " v1." + str(idx)

        # Generate a random country name
        geography_term = random_country()

        # Generate a unique ID for the activity
        random_uuid = uuid.uuid4()

        if is_ecospold == True:
            create_ecospold_triples(global_graph,RDFS_NAMESPACE,random_uuid,activity_name, geography_term)
        else:
            create_ILCD_triples(global_graph,RDFS_NAMESPACE,random_uuid,activity_name, geography_term)        

    # Serialize the RDF graph to a file
    global_graph.serialize(destination=FILENAME_BASE + str(time.time()) + ".ttl")


if __name__ == '__main__':
    main()
