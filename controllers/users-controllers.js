const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch(err) {    
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.log(errors);
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, email, password, places } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch(err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',  
            500
        );
        return next(error);
    }      

    if(existingUser) {
        return next(
            new HttpError(
                'User exists already, please login instead.', 
                422
            )
        );
    }   

    const createUser = new User({
        name,
        email,
        password,
        image: 'https://pbs.twimg.com/profile_images/1485507419834501121/3N7g0k1o_400x400.jpg',
        places
    });

    try {
        await createUser.save();
    } catch(err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }   

    res.status(201).json({user: createUser.toObject({ getters: true })});
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch(err) {
        const error = new HttpError(
            'Logged in failed, please try again later.',  
            500
        );
        return next(error);
    }  
    
    if(!existingUser || existingUser.password !== password) {
        return next(
            new HttpError('Invalid credentials, could not log you in.', 401)
        );
    }

    res.json({message: 'logged in'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;