// Gouvernance & gestion des droits (Node.js + Casbin RBAC, ES module)
import { newEnforcer, newModelFromString } from 'casbin';
import express from 'express';

const app = express();
app.use(express.json());

// Exemple de modèle et de politique Casbin en mémoire
const modelText = `
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
`;

const policyText = `
p, admin, governance, write
p, annotateur, governance, read
g, alice, admin
g, bob, annotateur
`;

let enforcer;
async function setupCasbin() {
  const model = newModelFromString(modelText);
  enforcer = await newEnforcer(model);
  // Charger la politique en mémoire (pas de loadPolicy sans adapter)
  const lines = policyText.trim().split('\n');
  for (const line of lines) {
    if (line && !line.startsWith('#')) {
      if (line.startsWith('p,')) {
        await enforcer.addPolicy(...line.replace('p, ', '').split(',').map(s => s.trim()));
      }
      if (line.startsWith('g,')) {
        await enforcer.addGroupingPolicy(...line.replace('g, ', '').split(',').map(s => s.trim()));
      }
    }
  }
}
await setupCasbin();

app.post('/governance', async (req, res) => {
  const { user, action } = req.body;
  // Vérifie le droit d'accès avec Casbin
  const allowed = await enforcer.enforce(user, 'governance', action);
  if (allowed) {
    res.json({ status: 'Autorisé', user, action, trace: Date.now() });
  } else {
    res.status(403).json({ status: 'Refusé', user, action, trace: Date.now() });
  }
});

app.listen(4004, () => console.log('Governance service with Casbin RBAC running on 4004'));
