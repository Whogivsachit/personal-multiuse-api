const rateLimit = require('express-rate-limit');

const rateLimits = rateLimit({
    windowMs: process.env.RATE_LIMIT || 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 60,
    message: { status: 429, message: 'Woah slow down! You\'re making too many requests. (60 requests every 1 minute)'},
    headers: true,
    keyGenerator: function (req) {
        return req.ip; // Use the client's IP address as the key
      }
});



module.exports = {
    rateLimit: rateLimits,
}