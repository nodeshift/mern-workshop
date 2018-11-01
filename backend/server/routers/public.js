const express = require('express');

module.exports = function(app){
  let router = express.Router();
  router.use(express.static(process.cwd() + '/public'));
  app.use(router);
}
