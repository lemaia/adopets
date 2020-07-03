const express = require('express');
const { mongoose } = require('../db/database');
const Product = mongoose.model('Product');
const log = require('simple-node-logger').createSimpleLogger({
    logFilePath: 'adopets.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});

const getProducts = async (queryParams, paginationParams) => {
    try {

        let query = [];

        if(queryParams.name !== null) {
            query.push({ name: new RegExp(queryParams.name, 'i') });
        }

        if(queryParams.description !== null) {
            query.push({ description: new RegExp(queryParams.description, 'i') });
        }

        if(queryParams.category !== null) {
            query.push({ category: new RegExp(queryParams.category, 'i') });
        }

        if(query.length == 0) {
            query.push({});
        }

        return await Product.paginate(
            {$or: query},
            paginationParams,
            {}
        );
    } catch (err) {
        log.error('Failed to get products - error: ', err);
        throw new Error('Failed to get products');
    }
}

const createProduct = async (data) => {
    try {
        const product = new Product(data);
        await product.save();

        return product;
    } catch (err) {
        log.error('Failed to create a product - error: ', err);
        throw new Error('Failed to create product');
    }
}

const updateProduct = async (productId, data) => {
    try {
        await Product.updateOne({ _id: productId }, data);
        return await Product.findOne({ _id: productId });
    } catch (err) {
        log.error('Failed to update a product - error: ', err);
        throw new Error('Failed to update a product');
    }
}

const deleteProduct = async (productId) => {
    try {
        await Product.deleteOne({ _id: productId })
    } catch (err) {
        log.error('Failed to delete a product - error: ', err);
        throw new Error('Failed to delete product');
    }
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };