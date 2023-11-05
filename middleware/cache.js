const NodeCache = require('node-cache');
const cache = new NodeCache( { stdTTL: process.env.CACHE_TTL || 60 } ); // 60 seconds

const cacheMiddleware = (req, res, next) => {
    const cacheKey = req.originalUrl;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) { return res.json(cachedData);}
    next();

    res.on('finish', () => {
        const data = res.cache;
        cache.set(cacheKey, data);
    });
}

module.exports = {
    cache: cacheMiddleware 
}