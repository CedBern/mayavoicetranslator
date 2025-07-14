// Serveur Express principal pour LivingLanguageLab
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const corporaRouter = require('./endpoints/corpora');
const childrenRoutes = require('./endpoints/children');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openapiSpec = YAML.load(__dirname + '/openapi.yaml');

const app = express();
const PORT = process.env.LIVINGLAB_PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Route principale pour les corpus
app.use('/api/livinglab/corpora', corporaRouter);
app.use('/api/livinglab/children', childrenRoutes);
app.use('/api/livinglab/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Healthcheck
app.get('/api/livinglab/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`LivingLanguageLab API running on http://localhost:${PORT}/api/livinglab`);
});
