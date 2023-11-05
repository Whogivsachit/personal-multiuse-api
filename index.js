const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('yaml');
const app = express();
const chalk = require('chalk');
dotenv.config();

// Import Middlewares
const { rateLimit } = require('./middleware/rateLimit.js');

// Setup the server
app.listen( process.env.port, () => console.log(`it's alive on http://${process.env.host}:${process.env.port}`));
app.use(express.json());
app.use(rateLimit); // Apply the rate limit middleware globally

// Setup the routes
app.use('/serverinfo', require('./endpoints/serverinfo.js'));
app.use('/auth', require('./endpoints/auth.js'));
app.use('/stock/advin', require('./endpoints/stock/advin.js'));
app.use('/stock/hop1', require('./endpoints/stock/hop1.js'));

// Setup Swagger Docs
const swaggerDoc = YAML.parse(fs.readFileSync('./swagger.yaml', 'utf8'));
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { customCss: '.swagger-ui .topbar { display: none }' }));
