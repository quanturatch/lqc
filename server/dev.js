const http = require('http');
const fs = require('fs');
const path = require('path');
const { loadEnv } = require('./db');

loadEnv();
const root = path.join(__dirname, '..');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.qa': 'text/plain; charset=utf-8'
};
const routes = {
  '/api/auth/request': '../api/auth/request',
  '/api/auth/verify': '../api/auth/verify',
  '/api/auth/logout': '../api/auth/logout',
  '/api/auth/me': '../api/auth/me',
  '/api/progress': '../api/progress'
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const route = routes[url.pathname];
  if (route) {
    const handler = require(route);
    return handler(req, res);
  }
  let file = path.normalize(path.join(root, decodeURIComponent(url.pathname)));
  if (!file.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return; }
  if (url.pathname.endsWith('/')) file = path.join(file, 'index.html');
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
});

const port = Number(process.env.PORT || 8080);
server.listen(port, '127.0.0.1', () => {
  console.log('Quantum Atlas at http://127.0.0.1:' + port);
});
