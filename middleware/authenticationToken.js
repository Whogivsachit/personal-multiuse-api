const jwt = require('jsonwebtoken');
const fs = require('fs');

// Blacklist
blacklist = [
    ""
]
// Authentication Middleware
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
   
    // Error handling related to middleware tokens
    if(blacklist.includes(token)) return res.stauts(401).send({ status: 401, message: 'This token has been banned' }); // Unauthorized
    if (token == null) return res.status(401).send({ status: 401, message: 'Authorization failed: Token not provided' }); // Unauthorized
    if(res.statusCode == 401) return res.status(401).send({ message: 'Authorization failed incorrect token or malformed token' }); 
    
    // Verify the token
    jwt.verify(token, process.env.secretKey, (err, user) => {
      if (err) return res.status(401).send({ status: 401, message: 'Authorization failed: incorrect token or malformed token' }); // Forbidden
      req.user = user;
      next();
    });
}

// Generate a token for a user and save it to a file
function generateToken(username) {
    const accessToken = jwt.sign({ username: username }, process.env.secretKey);
    const tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf8'));

    // Check if the token already exists
    if (tokens[username]) return `Token already exists for ${username}`;
    
    tokens[username] = accessToken;
    fs.writeFileSync('tokens.json', JSON.stringify(tokens, null, 2));
    console.log('Token saved to file', accessToken);
    
    return accessToken; // Return the token
}

module.exports = {
    auth: authMiddleware,
    generateToken
}