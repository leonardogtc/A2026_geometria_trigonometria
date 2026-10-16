/**
 * server.js - Servidor HTTP nativo simples em Node.js (sem dependências externas)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url === '/' ? '/index.html' : req.url;
  // Remove query params
  reqPath = reqPath.split('?')[0];

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 Não Encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end(`Erro no servidor: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
  console.log('Abra o endereço acima no seu navegador para ver o visualizador interativo.');
  console.log('Pressione CTRL+C para encerrar o servidor.');
  console.log('====================================================');
});
