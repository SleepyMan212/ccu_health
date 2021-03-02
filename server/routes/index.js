var express = require('express');
var router = express.Router();
const db = require('../models');
const { Equipment } = db;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.info(Equipment);
});

module.exports = router;
