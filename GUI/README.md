# WISER Frontend

This GUI is a base demonstrator set up to demonstrate the semantic backbone of the WISER knowledge graph in a simple web based applications in order to test each iteration with the domain experts in a known environment. It is not meant to use for production.

## Installation

To install this application, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.

## Usage

To run the application, follow these steps:
1. change the GraphDB Url ![at line 30 of the index.js file](src/index.js) to point your GraphDB instance
2. change the name of the repository to your repository name ![at line 31 of the index.js file](src/index.js) to query your repository
3. in case you should use OAuth as an authentication mechanism set the tokenState to "true" ![at line 32 of the index.js file](src/index.js) otherwise you can leave it empty (it will display a textarea, where you can paste your access_token)
4. next run the application with this command:

```bash
npm start
```

