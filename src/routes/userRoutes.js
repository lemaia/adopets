const express = require('express');
const { mongoose } = require('../db/database');
const { check, validationResult } = require('express-validator');
const { signup, signout, generateToken, isEmailInUse } = require('../services/userService');
const { logAction } = require('../services/actionlogService');
const requireAuth = require('../middlewares/requireAuth');
const User = mongoose.model('User');
const router = express.Router();

const errorFormatter = ({ msg }) => {
    return msg;
}

const signupValidation = [
    check('name').notEmpty().withMessage('Name is missing'),
    check('email').isEmail().withMessage('Email is missing'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min:5 }).withMessage('Password lenght should be at least 5')
];

const signinValidation = [
    check('email').isEmail().withMessage('Email is missing'),
    check('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min:5 }).withMessage('Password lenght should be at least 5')
];

const handleValidationError = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    next();
}

router.post('/signup', [signupValidation, handleValidationError], async (req, res) => {
    try {

        const { name, email, password } = req.body;

        if(await isEmailInUse(email)) {
            return res.status(422).send({ message: 'Email Already in use' });
        }

        const data = { name, email, password };
        const user = await signup(data);
        const token = await generateToken(user._id);


        return res.status(201).send({ token });

    } catch (err) {
        log.error('signup route - error: ', err);
        return res.status(500).send({ message: 'Failed to create an account' });
    }
});

router.post('/signin', [signinValidation, handleValidationError], async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            res.status(401).send({ message: 'Check your credentials' });
        }

        await user.comparePassword(password);
        const token = await generateToken(user._id);

        await logAction(user._id, 'logging in');

        res.status(200).send({ token });
    } catch (err) {
        log.error('loggin route - error: ', err);
        return res.status(500).send({ message: 'Failed to signin' });
    }
});

router.post('/logout', [requireAuth], async (req, res) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.replace('Bearer ', '');

        await signout(token);
        await logAction(req.user._id, 'logging out');

        res.status(204).send({});
    } catch (err) {
        log.error('logout route - error: ', err);
        return res.status(500).send({ message: 'Failed to signout' });
    }
});

module.exports = router;