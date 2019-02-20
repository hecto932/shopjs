const express = require('express');
const router = express.Router();
const { productsMock } = require('../../utils/mocks/products');

router.get('/', function (req, res) {
  res.render('products', { products: productsMock });
})

module.exports = router;