const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const e = require('express');
const getCoordsForAddress = require('../util/location');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous skyscrapers in the world!',
        location: {
            lat: 40.7484,
            lng: -73.9851
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous skyscrapers in the world!',
        location: {
            lat: 40.7484,
            lng: -73.9851
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];



const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => p.id === placeId);
    if (!place) {
        //return res.status(404).json({message: 'Place not found!'});
        // const error = new Error('Could not find a place for the provided id.');
        // error.code = 404;
        // next(error);
        throw new HttpError('Could not find a place for the provided id.', 404)
    }
    
    res.json({place});
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const userPlaces = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    });

    if (!userPlaces || userPlaces.length === 0) {
        //return res.status(404).json({message: 'User place not found!'});
        return next(
            new HttpError('Could not find a user place for the provided user id.',404)
        );
    }

    res.json({userPlaces});
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { title, description, address, creator } = req.body;
    // const title = req.body.title;
    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    const createPlace = {
        id: uuidv4(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createPlace);

    res.status(201).json({place: createPlace});
};

const updatePlace = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { title, description } = req.body;
    // const title = req.body.title;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId)};

    const palceIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[palceIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace});
};

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if(!DUMMY_PLACES.find(p => p.id === placeId)) {
        return next(
            new HttpError('Could not find a place for that id.', 404)
        );
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id === placeId)

    res.status(200).json({message: "Deleted palce."})

};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;