
const { ProductRepository } = require('../repositories/ProductRepository');

const productRepository = new ProductRepository();

async function createProduct(req, res) {
  try {
    const { name, price, category } = req.body;

    if (!name || !price || Number(price) <= 0) {
      return res.status(400).json({
        message: 'Valid name and positive price are required',
      });
    }

    const product = await productRepository.create({
      name,
      price,
      category,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

async function getProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'Invalid product ID',
      });
    }

    const product = await productRepository.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, price, category } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'Invalid product ID',
      });
    }

    if (!name || !price || Number(price) <= 0) {
      return res.status(400).json({
        message: 'Valid name and positive price are required',
      });
    }

    const product = await productRepository.update(id, {
      name,
      price,
      category,
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: 'Invalid product ID',
      });
    }

    const deleted = await productRepository.delete(id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
