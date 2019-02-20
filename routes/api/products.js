const debug = require('debug')('app:server');
const express = require('express');
const ProductService = require('../../services/products');

const productService = new ProductService();

function productsApi (app) {
  const router = express.Router();
  app.use('/api/products', router);

  router.get('/', async function (req, res, next) {
    const { tags } = req.query;

    try {
      const products = await productService.getProducts({ tags })

      res.status(200).json({
        data: products,
        message: `products listed`
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:productId', async function (req, res, next) {
    const { productId } = req.params;
    
    try {
      const product = await productService.getProduct({ productId })

      res.status(200).json({
        data: product,
        message: `product listed`
      });
    } catch (err) {
      next(err)
    }
  });

  router.post('/', async function (req, res, next) {
    const { body:product } = req;
    
    try {
      const productCreadted = await productService.createProduct({ product })
    
      res.status(201).json({
        data: productCreadted,
        message: `product listed`
      });
    } catch (err) {
      next(err)
    }
  });

  router.put('/:productId', async function (req, res, next) {
    const { productId } = req.params;
    const { body:product } = req;
    
    try {
      const updateProduct = await productService.updateProduct({ productId, product })

      res.status(200).json({
        data: updateProduct,
        message: `product listed`
      });
    } catch (err) {
      next(err)
    }
  });

  router.delete('/:productId', async function (req, res, next) {
    const { productId } = req.params;

    try {
      const productDelete = await productService.deleteProduct({ productId })
      res.status(200).json({
        data: productDelete,
        message: `product listed`
      });
    } catch (err) {
      next(err)
    }
  });
}

module.exports = productsApi;