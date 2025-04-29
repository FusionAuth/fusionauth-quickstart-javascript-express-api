const express = require('express');
const router = express.Router();
const hasRole = require('../services/hasRole');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/panic', hasRole(['teller']), (req, res, next) => {
  res.json({ message: "We've called the police!" });
});

router.get('/make-change', hasRole(['customer', 'teller']), (req, res, next) => {
  const amount = req.query.total;
  const result = { total: 0, nickels: 0, pennies: 0};
  result.total = Math.trunc(Number.parseFloat(amount)*100)/100;
  result.nickels = Math.floor(amount / 0.05);
  const pennies = ((amount - (0.05 * result.nickels)) / 0.01);
  result.pennies = Math.ceil((Math.trunc(pennies*100)/100));
  const error = ! /^(\d+(\.\d*)?|\.\d+)$/.test(amount);
  if (error)
    return res.status(400).json({ error: 'Invalid or missing "total" parameter' })
  res.json(result);
});

module.exports = router;
