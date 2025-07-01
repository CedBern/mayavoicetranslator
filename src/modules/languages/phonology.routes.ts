// Squelette Fastify pour endpoint phonologie
import { FastifyInstance } from 'fastify';

export default async function phonologyRoutes(fastify: FastifyInstance) {
  fastify.get('/api/phonology', async (_request: any, reply: any) => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../../../ressources_phonetiques/proto_mayan_phonology.json');
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      reply.header('Content-Type', 'application/json; charset=utf-8');
      return JSON.parse(data);
    } catch (err) {
      reply.code(500).send({ error: 'Erreur lors de la lecture du fichier phonologie.' });
    }
  });
}
