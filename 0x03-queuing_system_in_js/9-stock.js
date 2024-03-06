#!/usr/bin/node
/**
 * Stock check
 */

import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

// Create a Redis client
const redisClient = createClient();

// Handle Redis client errors
redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

// Array containing list of products
const listProducts = [
  {
    id: 1, name: 'Suitcase 250', price: 50, stock: 4,
  },
  {
    id: 2, name: 'Suitcase 450', price: 100, stock: 10,
  },
  {
    id: 3, name: 'Suitcase 650', price: 350, stock: 2,
  },
  {
    id: 4, name: 'Suitcase 1050', price: 550, stock: 5,
  },
];

/**
 * Transforms product object to desired format
 * @param {Object} product - Product object
 * @returns {Object} - Transformed product object
 */
const transformProduct = (product) => ({
  itemId: product.id,
  itemName: product.name,
  price: product.price,
  initialAvailableQuantity: product.stock,
});

/**
 * Retrieves product by id
 * @param {number} id - Product ID
 * @returns {Object|null} - Product object or null if not found
 */
const getProductById = (id) => listProducts.find((product) => product.id === id);

/**
 * Retrieves all products in desired format
 * @returns {Array} - Array of transformed product objects
 */
const getProducts = () => listProducts.map(transformProduct);

/**
 * Reserves stock for a given item id
 * @param {number} itemId - Item ID
 * @param {number} stock - Stock quantity to reserve
 * @returns {Promise<void>} - Promise indicating completion
 */
const reserveStockById = async (itemId, stock) => {
  const SET = promisify(redisClient.set).bind(redisClient);
  await SET(`item.${itemId}`, stock);
};

/**
 * Retrieves current reserved stock for a given item id
 * @param {number} itemId - Item ID
 * @returns {Promise<number>} - Promise resolving to the current reserved stock
 */
const getCurrentReservedStockById = async (itemId) => {
  const GET = promisify(redisClient.get).bind(redisClient);
  const stock = await GET(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : 0;
};

// Create Express application
const app = express();

// Route to get list of products
app.get('/list_products', (req, res) => {
  res.json(getProducts());
});

// Route to get product details by item ID
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getProductById(itemId);
  if (product) {
    const stock = await getCurrentReservedStockById(itemId);
    product.currentQuantity = product.stock - stock;
    res.json(transformProduct(product));
  } else {
    res.json({ status: 'Product not found' });
  }
});

// Route to reserve product by item ID
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getProductById(itemId);
  if (!product) {
    res.json({ status: 'Product not found' });
  } else {
    const stock = await getCurrentReservedStockById(itemId);
    if (stock >= product.stock) {
      res.json({ status: 'Not enough stock available', itemId });
    } else {
      await reserveStockById(itemId, stock + 1);
      res.json({ status: 'Reservation confirmed', itemId });
    }
  }
});

/**
 * Clear Redis stock for all products
 * @returns {Promise<void>} - Promise indicating completion
 */
const clearRedisStock = async () => {
  const SET = promisify(redisClient.set).bind(redisClient);
  await Promise.all(listProducts.map((item) => SET(`item.${item.id}`, 0)));
};

// Start Express server
app.listen(1245, async () => {
  await clearRedisStock();
  console.log('API available on localhost via port 1245');
});
