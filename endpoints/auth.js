const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { auth, generateToken } = require('../middleware/authenticationToken.js');

// Return a 404 if no username is provided
router.post('/:generate?', (req, res) => {
    res.status(400).send({ status: 400, data: 'Please provide a username to generate a token', example: '/auth/generate/<username>' }); // Return a 404 if no username is provided
});

// Generate a token for a user
router.post('/generate/:username', auth, (req, res) => {

    let username = req.params.username;
    let token = generateToken(username);

    // Return 409 if the token already exists.
    if(token === `Token already exists for ${username}`) return res.send({ status: 409, message: token }); // Return 409 if the token already exists.
    // Return 200 if the token was generated successfully. and send the token
    res.send({ status: 200, message: 'Token generated', token: token }); // Return 200 if the token was generated successfully. and send the token
});



router.get('/verify/:token', (req, res) => {
    let token = req.params.token;
    jwt.verify(token, process.env.secretKey, (err, user) => {
        if (err) return res.status(401).send({ status: 401, message: 'Authorization failed: incorrect token or malformed token' }); // Forbidden
        res.send({ status: 200, message: 'Authorization successful', user: user.username, token: req.params.token});
    });

});

module.exports = router;