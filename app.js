const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/palces-routes');
const usersRoutes = require('./routes/users-routes');
const productsRoutes = require('./routes/products-routes');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;   

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(res.headerSent)   {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({message: error.message || "An unkown error found"})

});

mongoose.connect(url)
    .then(() => {
        app.listen(5000);
        //console.log('Connected to MongoDB');            
    })
    .catch(err => {
        console.log('Failed to connect to MongoDB', err);
    });

// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// });