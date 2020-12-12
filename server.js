// require('newrelic');
const express = require('express');
const path = require('path');
const compression = require('compression');
const router = require('./db/arango/router.js');

const port = 2002;

const app = express();

app.use(compression());
app.use('/', express.static(__dirname + 'client/dist'));
app.use(express.json());


app.get('/api/listings/:id', router.get);


app.listen(port, ()=> {
  console.log(`listening on port ${port}`)
})
