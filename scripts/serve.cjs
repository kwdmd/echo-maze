const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/game.js', ['game.js', 'text/javascript; charset=utf-8']]
]);
const port = Number(process.env.PORT || 8080);
const server = http.createServer((req, res) => {
  const resource = files.get(req.url.split('?')[0]);
  if (!resource) { res.writeHead(404); res.end('Not found'); return; }
  fs.readFile(path.join(root, resource[0]), (error, data) => {
    if (error) { res.writeHead(500); res.end('Unable to read file'); return; }
    res.writeHead(200, { 'Content-Type': resource[1], 'Cache-Control': 'no-store' });
    res.end(data);
  });
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`ECHO MAZE: http://localhost:${port}\nStop: Ctrl+C`));
