
// Microservice NMT/LLM - Node.js (Express + Casbin RBAC, ES module)
import { newEnforcer, newModelFromString } from 'casbin';
import express from 'express';

const app = express();
app.use(express.json());

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
p, admin, nmt-llm, write
p, annotateur, nmt-llm, read
g, alice, admin
g, bob, annotateur
`;

let enforcer;
async function setupCasbin() {
  const model = newModelFromString(modelText);
  enforcer = await newEnforcer(model);
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

app.post('/translate', async (req, res) => {
  const { user, action } = req.body;
  const allowed = await enforcer.enforce(user, 'nmt-llm', action || 'write');
  if (!allowed) {
    return res.status(403).json({ status: 'Refusé', user, action, trace: Date.now() });
  }
  // TODO: Intégrer NMT/LLM
  res.json({ translation: 'Traduction simulée', trace: Date.now() });
});

app.listen(4001, () => console.log('NMT/LLM service with Casbin RBAC running on 4001'));
