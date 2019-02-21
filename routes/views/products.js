const express = require('express');
const router = express.Router();
const ProductsService = require('../../services/products')

const productService = new ProductsService();

const cacheResponse = require('../../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS } = require('../../utils/time');

router.get('/', async function (req, res, next) {
  // ADDING CACHE FOR LIST 5 minutes
  
  cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
  const { tags } = req.query;
  try { 
    // throw new Error('Its not working from view');
    const products = await productService.getProducts({ tags });
    res.render('products', { products });
  } catch (err) {
    next(err);
  } 
})

module.exports = router;