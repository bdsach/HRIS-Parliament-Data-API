const jsonServer = require("json-server");
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
const express = require("express");

var server = express();

server.use(middlewares);
server.use(router);

console.log("Server running on port " + port);

server.listen(port);
