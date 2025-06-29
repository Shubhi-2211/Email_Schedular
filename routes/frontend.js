const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');

// 📌 Home (create form)
router.get('/', (req, res) => {
  res.render('create');
});

module.exports = router;
