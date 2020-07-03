const express = require('express');
const { check, validationResult } = require('express-validator');
const requireAuth = require('../middlewares/requireAuth');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../services/productService');
const { logAction } = require('../services/actionlogService');
const router = express.Router();

router.use(requireAuth);

const errorFormatter = ({ msg }) => {
    return msg;
}

const productDataValidation = [
    check('name').notEmpty().withMessage('Product name required'),
    check('description').notEmpty().withMessage('Product description required'),
    check('category').notEmpty().withMessage('Product category required'),
    check('price').notEmpty().withMessage('Product price required'),
    check('price').notEmpty().isFloat({ min: 0.01 }).withMessage('Product price invalid'),
    check('qty').notEmpty().withMessage('Product quantity required'),
]

const handleValidationError = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    next();
}

router.get('/products', async (req, res) => {
    try {
        const paginationParams = {
            page: req.query.page || 1,
            limit: req.query.limit || 10
        };

        const queryParams = {
            name: req.query.name || null,
            description: req.query.description || null,
            category: req.query.category || null
        };

        await logAction(req.user._id, 'listing products', req.query);

        res.status(200).send(await getProducts(queryParams, paginationParams));
    } catch (err) {
        return res.status(404).send({ message: 'No Products' });
    }
});

router.post('/products', [productDataValidation, handleValidationError], async (req, res) => {
    try {
        const { name, description, category, price, qty } = req.body;
        const data = { name, description, category, price, qty };

        const product = await createProduct(data);


        await logAction(req.user._id, 'creating product', product);

        res.status(201).send(product);
    } catch (err) {
        return res.status(500).send({ message: 'Failed to create product' });
    }
});

router.put('/products/:productId', [productDataValidation, handleValidationError], async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, category, price, qty } = req.body;
        const data = { name, description, category, price, qty };

        const product = await updateProduct(productId, data);

        await logAction(req.user._id, 'updating product', product);

        res.status(200).send(product);
    } catch (err) {
        return res.status(500).send({ message: 'Failed to update product' });
    }
});

router.delete('/products/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        await deleteProduct(productId);

        await logAction(req.user._id, 'deleting product', productId);

        res.status(204).send({});
    } catch (err) {
        return res.status(500).send({ message: 'Failed to delete product' });
    }
});

module.exports = router;