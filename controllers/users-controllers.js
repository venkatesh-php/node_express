const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');

let DUMMY_USERS = [
    {
        id: 'u1',
        name: "dv",
        email: "u1@gmail.com",
        password: "u1user"
    }
]

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS});
};

const signup = (req, res, next) => {
    const { name, email, password } = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);

    if(hasUser){
        throw new HttpError('Could not create user, email already exists.', 401);
    }

    const createUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createUser);;

    res.status(200).json({user: createUser});
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);

    if(!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
    }

    res.json({message: 'logged in'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;