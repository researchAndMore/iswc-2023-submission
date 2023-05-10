# Wiser Integrator

This project parses EcoSpold and ILCD data sets and inserts it into a graph according to the Wiser Ontology.

## Installation

1. Install Gradle: If Gradle is not already installed on your machine, download and install it
2. Navigate to the project directory
3. Build the project with ./gradlew build

## Usage
1. Take your EcoSpold02 or ILCD data and put them in the ![resources folder](src\main\resources)
2. Adjust the filenames in the ![WiserIntegrator.java](src\main\java\ch\unisg\ics\interactions\wiser\WiserIntegrator.java)
3. Change the credentials (username and password) and the SparkQL endpoint in the
   ![GraphDBInterface.java](src/main/java/ch/unisg/ics/interactions/wiser/tools/GraphDBInterface.java)
4. Run the program: ![WiserIntegrator.java](src\main\java\ch\unisg\ics\interactions\wiser\WiserIntegrator.java)