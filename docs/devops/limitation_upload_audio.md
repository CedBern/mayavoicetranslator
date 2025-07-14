# Limitation de la taille des fichiers audio uploadés (Node.js & Nginx)

Ce guide explique comment limiter la taille des fichiers audio uploadés, côté Node.js (Express, multer, busboy) et côté Nginx.

## 1. Limitation côté Node.js (Express)

### Avec express.json() / express.urlencoded()
```js
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
```

### Avec Multer
```js
const multer  = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});
app.post('/uploadAudio', upload.single('audioFile'), (req, res) => {
  res.send('Fichier bien reçu');
});
// Gestion de l’erreur Multer
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Fichier trop volumineux' });
  }
  next(err);
});
```

### Avec Busboy
```js
const Busboy = require('busboy');
app.post('/uploadAudio', (req, res) => {
  const busboy = new Busboy({ headers: req.headers, limits: { fileSize: 5 * 1024 * 1024 } });
  busboy.on('file', (fieldname, file, filename) => {
    file.on('limit', () => {
      res.status(413).send('File too large');
      file.resume();
    });
    file.pipe(fs.createWriteStream('/uploads/' + filename));
  });
  busboy.on('finish', () => res.end('Upload terminé'));
  req.pipe(busboy);
});
```

## 2. Limitation côté Nginx

Ajoutez dans la config Nginx :
```nginx
server {
    client_max_body_size 20M;
    location /upload {
        client_max_body_size 10M;
        proxy_pass http://localhost:3000;
    }
}
```
- **Reload Nginx après modification :**
  ```bash
  sudo nginx -t && sudo systemctl reload nginx
  ```

## Bonnes pratiques
- Limitez côté Node.js ET Nginx (défense en profondeur)
- Prévoyez une gestion d’erreur claire (code 413)
- Informez l’utilisateur côté client (JS)
- Adaptez la limite à vos besoins (ex : 10 MB, 20 MB)

---

En combinant ces méthodes, vous protégez votre application contre les uploads excessifs et améliorez la robustesse du service.
