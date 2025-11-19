const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
dotenv.config();
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;   

const Product = require('../models/products'); 

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB');        
    })
    .catch(err => {
        console.log('Failed to connect to MongoDB', err);
    });



const createProduct = async (req, res, next) => {
    const createdProduct = new Product({
        name: req.body.name,
        price: req.body.price
    }); 

    const result = await createdProduct.save();

    res.status(201).json({ product: result });

    //old code using MongoClient
    //const client = new MongoClient(url);
    // try {
    //     await client.connect();
    //     const db = client.db();
    //     const productsCollection = db.collection('products');
    //     const result = await productsCollection.insertOne(newProduct);
    //     res.status(201).json({ product: newProduct });
    // } catch (err) {
    //     const error = new HttpError('Creating product failed, please try again.', 500);
    //     return next(error);
    // }

    // client.close();
    // res.status(201).json({ product: newProduct });
};

const getProducts = async (req, res, next) => {

    const products = await Product.find().exec();
    res.status(200).json({ products: products });

    //old code using MongoClient
    // const client = new MongoClient(url);
    // let products;   

    // try {
    //     await client.connect();
    //     const db = client.db();
    //     const productsCollection = db.collection('products');
    //     products = await productsCollection.find().toArray();
    // } catch (err) {
    //     const error = new HttpError('Fetching products failed, please try again later.', 500);
    //     return next(error);
    // }

    // client.close();
    // res.status(200).json({ products: products });
};


exports.getProducts = getProducts;
exports.createProduct = createProduct;
