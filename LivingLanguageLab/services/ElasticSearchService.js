// Service d'intégration ElasticSearch
// Usage : recherche sémantique multilingue
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });

async function searchIndex(index, query) {
  try {
    const res = await client.search({ index, body: { query } });
    return res.body.hits.hits;
  } catch (err) {
    throw new Error('Erreur ElasticSearch: ' + err.message);
  }
}

module.exports = { searchIndex };
