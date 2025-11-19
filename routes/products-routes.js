const express = require('express');
const { check } = require('express-validator');

const productsControllers = require('../controllers/products-controllers');

const router = express.Router();



router.get('/', productsControllers.getProducts);

router.post('/', productsControllers.createProduct);


module.exports = router;