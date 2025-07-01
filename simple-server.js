const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log('Requête reçue:', req.url);
  
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Serveur Simple</title>
      </head>
      <body>
        <h1>Serveur HTTP Simple Fonctionne!</h1>
        <p>Si vous voyez ceci, le serveur HTTP simple marche.</p>
        <script>
          console.log("JS fonctionne sur serveur simple");
        </script>
      </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3001;
server.listen(port, 'localhost', () => {
  console.log(`Serveur simple en marche sur http://localhost:${port}`);
});
