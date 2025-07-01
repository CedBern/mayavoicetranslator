// Middleware Express pour mocker les endpoints critiques en CI/test
export function mockApiMiddleware(req, res, next) {
  // /api/status
  if (req.path.replace(/\/$/, '') === '/api/status') {
    return res.json({ status: 'ok', version: 'test', uptime: 0, timestamp: new Date().toISOString() });
  }
  // /api/usage/paid
  if (req.path.replace(/\/$/, '') === '/api/usage/paid') {
    return res.json({ success: true, total: 0, usage: [], summary: {} });
  }
  // /api/suggestions
  if (req.path.replace(/\/$/, '') === '/api/suggestions') {
    if (!req.headers['authorization']) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const text = req.query.text || '';
    let suggestions;
    if (text.length < 3) {
      suggestions = ['Entrée incomplète, veuillez préciser', 'Exemple de suggestion'];
    } else {
      suggestions = ['Suggestion 1', 'Suggestion 2'];
    }
    return res.json({ success: true, suggestions });
  }
  // /api/translate
  if (req.path.replace(/\/$/, '') === '/api/translate') {
    if (!req.headers['authorization']) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { text, fromLang, toLang } = req.body || {};
    if (!text || !fromLang || !toLang) {
      return res.status(400).json({ error: 'Paramètres requis: text, fromLang, toLang' });
    }
    if (text.length < 3) {
      return res.status(200).json({ success: false, message: 'Votre demande semble incomplète ou ambiguë. Pouvez-vous préciser ce que vous souhaitez ?' });
    }
    return res.json({ success: true, translation: `Traduction mockée de: ${text}` });
  }
  // /api/payment/intent
  if (req.path.replace(/\/$/, '') === '/api/payment/intent') {
    return res.status(201).json({ clientSecret: 'mocked_secret', status: 'requires_action' });
  }
  next();
}
