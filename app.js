const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/palces-routes');
const usersRoutes = require('./routes/users-routes');
const productsRoutes = require('./routes/products-routes');


const app = express();

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


app.use(bodyParser.json());

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});