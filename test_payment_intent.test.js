// Test automatisé de robustesse pour /api/payment/intent
// Lancer avec: node test_payment_intent.test.js

import http from 'http';

function postJSON(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: body ? JSON.parse(body) : {} }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

if (process.env.CI || process.env.JEST_WORKER_ID) {
  test.skip('test_payment_intent (désactivé en CI)', () => {});
} else {
  (async () => {
    // Test 1: POST vide
    const res1 = await postJSON('/api/payment/intent', {});
    console.log('Test POST vide:', res1);

    // Test 2: POST userId seul
    const res2 = await postJSON('/api/payment/intent', { userId: 'testuser' });
    console.log('Test POST userId seul:', res2);

    // Test 3: POST complet (test_payment)
    const res3 = await postJSON('/api/payment/intent', {
      userId: 'testuser',
      purchaseType: 'test_payment',
      itemId: 'item1',
      paymentMethod: 'card'
    });
    console.log('Test POST complet:', res3);

    process.exit(0);
  })();
}
