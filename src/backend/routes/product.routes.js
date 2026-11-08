const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

router.post('/', createProduct);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;