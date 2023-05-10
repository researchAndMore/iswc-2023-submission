/**
 * 
 * @param {number} max max value to indicate the highest number of index for the blank node
 * @returns string in the format of blank node ready to be inserted
 */
function getRandomBlankNode(max) {
    let random = Math.floor(Math.random() * max);
    return " _:b" + random + " "
}

/**
 * 
 * @param {String} query SPARQL query generated 
 * @param {String} graphDBURL URL of your graphDB instance (can be set @index.js)
 * @param {String} repository name of your repository (can be set @index.js)
 * @param {String} token bearer authentication token (OAuth) if used
 * @returns query result of the SPARQL query
 */
async function getDataFromGraphDB(query, graphDBURL, repository, token) {
    if (token && token.length > 0) {
        const StreamClient = require("sparql-http-client")
        const endpointUrl = graphDBURL + repository
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        const client = new StreamClient({
            endpointUrl: endpointUrl, headers: {
            'Authorization': 'Bearer ' + token
        } })
        const stream = await client.query.select(query)

        const chunks = [];
        const sparkPromise = new Promise((resolve, reject) => {

            stream.on('data', row => {
                const dict = []
                Object.entries(row).forEach(([label, value]) => {
                    dict.push(
                        {
                            value: value.value,
                            key: label
                        })
                })
                chunks.push(dict)
            })
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(chunks));

        })

        let result = await sparkPromise;

        return result
    } else {
        console.log("please provide a token")
    }
}


export { getDataFromGraphDB, getRandomBlankNode }