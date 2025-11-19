const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();
const HttpError = require('../models/http-error');

const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;   

const getProducts = async (req, res, next) => {
    const client = new MongoClient(url);
    let products;   

    try {
        await client.connect();
        const db = client.db();
        const productsCollection = db.collection('products');
        products = await productsCollection.find().toArray();
    } catch (err) {
        const error = new HttpError('Fetching products failed, please try again later.', 500);
        return next(error);
    }

    client.close();
    res.status(200).json({ products: products });
};

const createProduct = async (req, res, next) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    }; 
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db();
        const productsCollection = db.collection('products');
        const result = await productsCollection.insertOne(newProduct);
        res.status(201).json({ product: newProduct });
    } catch (err) {
        const error = new HttpError('Creating product failed, please try again.', 500);
        return next(error);
    }

    client.close();
    res.status(201).json({ product: newProduct });
};


exports.getProducts = getProducts;
exports.createProduct = createProduct;
