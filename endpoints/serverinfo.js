const express = require('express');
const router = express.Router();
const gamedig = require('gamedig');
const { cache } = require('../middleware/cache.js');

// Return a 418 if no game or ip:port is provided
router.get('/:game?', async (req, res) => {
    res.status(418).send({ status: 418, data: 'Please provide the game, ip & port if applicable', example: '/serverinfo/<game>/<ip>:<port>' }); // Return a 404 if no game or ip:port is provided
});

// List Specific Game server Information
router.get('/:game/:ip::port', cache, async (req, res) => {
    const { game, ip, port } = req.params; // get the id from the request;
    if(!game || !ip || !port) return res.status(418).send({ message: 'Please provide the game, ip & port' }); // Return a 404 if no game or ip:port is provided

    try {
        const data = await gamedig.query({ type: game, host: ip, port: port, });
        const serverInfo = { // Don't ask Theres multiple types it can be and its possible the server doesn't have all the data.
            status: res.statusCode,
            data: {
                name: data.name,
                ip: data.connect,
                ping: data.ping,
                version: data.raw?.vanilla?.raw?.version?.name ?? data.raw?.version,
                map: data.map ?? "No Map",
                players: data.raw?.vanilla?.raw?.players?.online ?? data.raw?.numplayers, 
                maxplayers: data.raw?.vanilla?.raw?.players?.max ?? data.maxplayers,
                playerArray: data.players
            }
        };

        res.cache = serverInfo;
        res.json(serverInfo);
    } catch (error) {
        res.status(500).send({ message: 'Server is offline' });
    }
});

module.exports = router;