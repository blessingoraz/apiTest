const validator = require('validator');
const jwt = require('jsonwebtoken');

const User  = require('../models/user');

exports.create = (req, res) => {
    const user = new User(req.body);
    const payload = {
        admin: user.admin,
        id: user._id
    };
    const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: 86400 // expires in 24 hours
    });
    user.token = token;
    if (!validator.isEmail(user.email)) return res.status(500).send({ message: "Email is not correct"});

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) res.status(500).send({ message: `Problem registering with email: ${req.body.email}` });
        if (user) res.status(500).send({ message: `User with email ${req.body.email} already exist` });
    });

    user.save((err, user) => {
        if (err) return res.status(500).send({ message: 'Cannot create a user' });
        res.status(201);
        res.send(user);
    });
}

exports.login = (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) res.status(500).send({ message: `Cannot find user with email: ${req.body.email}` });
        if (!user) return res.status(404).send({ message: 'No user found.'});
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err || isMatch === false) res.status(500).send({ message: `You cannot login` });
            const token = jwt.sign({ id: user._id }, process.env.SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });
            user.token = token;
            res.status(200);
            res.send(user);
        });
    });
};

exports.findAll =  (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        User.find({}, (err, users) => {
            if (err) res.status(500).send({ message: 'Cannot retrieve users' });
            if (!users) return res.status(404).send({ message: "No users found." });

            res.json(users);
        });
    });
};

exports.findOne = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.findById(req.params.userId).populate('predictions').exec((err, user) => {
            if (err) res.status(500).send({ message: 'Cannot retrieve user' });
            res.send(user);
        });
    });
};

exports.update = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.findById(req.params.userId, (err, user) => {
            if (err) res.status(500).send({ message: 'Cannot retrieve user' });
            user.username = req.body.username;
            user.email = req.body.email;

            user.save((err, user) => {
                if (err) res.status(500).send({ message: 'Cannot create a user' });
                res.status(200).send(user);
            });
        });
    });
};

exports.delete = (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        User.remove({ _id: req.params.userId }, (err, user) => {
            if (err) res.status(500).send({ message: 'Cannot delete this user' });
            res.status(200).send({ message: 'User deleted' });
        })
    });
};
