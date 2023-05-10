package ch.unisg.ics.interactions.wiser.tools;

import org.eclipse.rdf4j.query.QueryLanguage;
import org.eclipse.rdf4j.query.Update;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.sparql.SPARQLRepository;

public class GraphDBInterface {

    private String szEndpoint = "https://wiser-flagship.interactions.ics.unisg.ch/repositories/test/statements";

    public void queryEndpoint(String szQuery) throws Exception {

        SPARQLRepository sparqlRepository = new SPARQLRepository(szEndpoint, szEndpoint);

        sparqlRepository.setUsernameAndPassword("nKesseli", "6V!s4NaV7");

        sparqlRepository.initialize();

        RepositoryConnection repositoryConnection = sparqlRepository.getConnection();

        repositoryConnection.begin();

        Update updateOperation = repositoryConnection.prepareUpdate(QueryLanguage.SPARQL, szQuery);

        updateOperation.execute();

        try {
            repositoryConnection.commit();
            repositoryConnection.close();
        } catch (Exception e) {
            repositoryConnection.rollback();
        }

    }

}
