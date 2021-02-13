#! /usr/bin/env node
  
const { handler } = require('./publish');

handler()
  .then(() => console.log('done...'));