const http = require('http');
const { v4: uuidv4 } = require('uuid');
const { successHandler, errorHandler } = require('./handler');

const headers = {
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
};
const todos = [];

const requestListener = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url === '/todos' && req.method === 'GET') {
    successHandler(res, headers, todos);
    return;
  }
  if (req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        if (JSON.parse(body).title === undefined) {
          errorHandler(res, headers, 404, '"title" is required');
          return;
        }
        todos.push({
          id: uuidv4(),
          title,
        });
        successHandler(res, headers, todos);
      } catch (err) {
        errorHandler(res, headers, 404, 'Unexpected end of JSON input');
      }
    });
    return;
  }
  if (req.url === '/todos' && req.method === 'DELETE') {
    todos.splice(0);
    successHandler(res, headers, todos);
    return;
  }
  if (req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((todo) => todo.id === id);
    if (index === -1) return errorHandler(res, headers, 404, '"Id" Not Found');
    todos.splice(index, 1);
    successHandler(res, headers, todos);
    return;
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    return;
  }
  errorHandler(res, headers, 404, 'Not Found');
};

const server = http.createServer(requestListener);
server.listen(8080);
